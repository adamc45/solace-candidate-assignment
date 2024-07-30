"use client";

import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function parseDropdownOption(value) {
	if (value === null || value === undefined) {
		return 0;
	}
	const parsedValue = +value;
	if (isNaN(parsedValue)) {
		return 0;
	}
	return parsedValue;
}

const useDebounce = (callback, timer) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, timer);
  }, []);

  return debouncedCallback;
};

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState("1");
  const [debouncer, setDebouncer] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [schemaErrors, setSchemaError] = useState([]);
  const [searchErrors, setSearchErrors] = useState([]);

  // Fetch dropdown option from backend
  useEffect(() => {
	 	fetch('/api/schema')
		 	.then(response => {
	 			if (!response.ok) {
	    		throw new Error(response.statusText);
	    	}
		  	response.json()
		  		.then((jsonResponse) => {
			    	setDropdownOptions(jsonResponse.data);
			    	setSearchErrors([]);
			    	setIsLoaded(true);
			    });
		  })
			.catch((e) => {
	    	setDropdownOptions([{
	    		id: 1,
	    		value: 'First Name'
	    	}]);
	    	setIsLoaded(true);
	    	const errors = [...schemaErrors].concat({
	    		timestamp: Date.now(),
	    		message: 'Error encountered loading dropdown options'
	    	});
	    	setSchemaError(errors);
	    })
  }, []);

  useEffect(() => {
  	const errors = [...schemaErrors, ...searchErrors];
  	errors.sort((a, b) => a.timestamp - b.timestamp);
  	setErrorMessages(errors);
  }, [searchErrors, schemaErrors]);

  // Trigger a new request whenever search term changes [in a debounced fashion]
  useEffect(() => {
    const id = parseDropdownOption(selectedDropdownOption);
		const params = new URLSearchParams({
			id,
	    searchTerm
		});
    fetch(`/api/advocates?${params.toString()}`)
	    .then((response) => {
	    	if (!response.ok) {
	    		throw new Error(response.statusText);
	    	}
	      response.json()
		      .then((jsonResponse) => {
		        setFilteredAdvocates(jsonResponse.data);
		        setSearchErrors([]);
		      });
	    })
	    .catch((e) => {
	    	setFilteredAdvocates([])
	    	const errors = searchErrors.concat({
	    		timestamp: Date.now(),
	    		message: 'Error encountered fetching advocates.'
	    	});
	    	setSearchErrors(errors);
	    });
  }, [debouncer]);

  const debouncedRequest = useDebounce(() => {
  	setDebouncer(debouncer + 1);
  }, 500)

  const columnSelectionChange = (e) => {
  	setSelectedDropdownOption(e.target.value);
  }

  const inputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    debouncedRequest();
  };

  const resetSelections = () => {
    setSearchTerm('');
    setSelectedDropdownOption(1);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      	{ errorMessages.length > 0 &&
      		<div className="error-container flex-container-vertical">
      			<div>The following errors were encountered:</div>
      			<div className="flex-container-vertical">
	      			{
	      				errorMessages.map((error, index) => <span key={index} className="error">{error.message}</span>)
	      			}
      			</div>
      		</div>
      	}
	      { isLoaded &&
		      <div className="selector-container flex-container-horizontal">
		        <select onChange={columnSelectionChange} value={selectedDropdownOption}>
		        {
		        	dropdownOptions.map((option, index) => {
		        		return <option key={index} value={option.id}>{option.value}</option>
		        	})
		        }
		        </select>
		        <input value={searchTerm} onChange={inputChange} placeholder="Search for Advocates..." />
		        <button onClick={resetSelections}>Reset Search</button>
		      </div>
	      }
			{ filteredAdvocates.length > 0 &&
				<table>
	        <thead>
		        <tr>
		          <th>First Name</th>
		          <th>Last Name</th>
		          <th>City</th>
		          <th>Degree</th>
		          <th>Specialties</th>
		          <th>Years of Experience</th>
		          <th>Phone Number</th>
		        </tr>
	        </thead>
	        <tbody>
	          {filteredAdvocates.map((advocate, i) => {
	            return (
	              <tr key={i}>
	                <td>{advocate.firstName}</td>
	                <td>{advocate.lastName}</td>
	                <td>{advocate.city}</td>
	                <td>{advocate.degree}</td>
	                <td>
	                  {advocate.specialties.map((s, index) => (
	                    <div key={index}>{s}</div>
	                  ))}
	                </td>
	                <td>{advocate.yearsOfExperience}</td>
	                <td>{advocate.phoneNumber}</td>
	              </tr>
	            );
	          })}
	        </tbody>
	      </table>
 			}
    </main>
  );
}
