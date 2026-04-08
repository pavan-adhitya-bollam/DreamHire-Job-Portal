import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Delhi",
      "Mumbai",
      "Kolhapur",
      "Pune",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Remote",
    ],
  },
  {
    filterType: "Technology",
    array: [
      "Frontend",
      "Backend", 
      "Full Stack",
      "Mobile",
      "Data Science & AI",
      "DevOps & Cloud",
      "Game Development",
      "Blockchain",
      "Cyber Security",
      "QA & Testing",
      "Database",
      "Architecture & Design"
    ],
  },
  {
    filterType: "Experience",
    array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Salary",
    array: ["0-50k", "50k-100k", "100k-200k", "200k+"],
  },
];

const Filter = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    Location: [],
    Technology: [],
    Experience: [],
    Salary: []
  });
  const dispatch = useDispatch();

  const handleChange = (filterType, value) => {
    console.log(`Filter clicked: ${filterType} = ${value}`);
    setSelectedFilters(prev => {
      const currentValues = prev[filterType] || [];
      const isCurrentlySelected = currentValues.includes(value);
      
      let newValues;
      if (isCurrentlySelected) {
        // Remove the value if it's already selected (deselect)
        newValues = currentValues.filter(item => item !== value);
      } else {
        // Add the value if it's not selected (select)
        newValues = [...currentValues, value];
      }
      
      console.log(`Previous filters:`, prev);
      console.log(`New filters:`, {
        ...prev,
        [filterType]: newValues
      });
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const clearAllFilters = () => {
    console.log("Clear all filters triggered!");
    setSelectedFilters({
      Location: [],
      Technology: [],
      Experience: [],
      Salary: []
    });
  };

  useEffect(() => {
    console.log("useEffect triggered with selectedFilters:", selectedFilters);
    // Construct query string from selected filters
    const queryParts = [];
    Object.entries(selectedFilters).forEach(([filterType, values]) => {
      if (values.length > 0) {
        // Convert filter type to lowercase and join values with commas
        const filterTypeLower = filterType.toLowerCase();
        const valuesString = values.join(',');
        queryParts.push(`${filterTypeLower}:${valuesString}`);
      }
    });
    const queryString = queryParts.join('|');
    console.log("Selected filters:", selectedFilters);
    console.log("Query string:", queryString);
    console.log("Dispatching to Redux...");
    dispatch(setSearchedQuery(queryString));
    console.log("Dispatch complete");
  }, [selectedFilters, dispatch]);

  return (
    <div className="w-[280px] bg-white p-5 rounded-xl shadow-md border sticky top-20 h-[88vh] overflow-y-auto">

      {/* TITLE */}
      <h1 className="text-lg font-bold mb-3 text-gray-800">
        🔍 Filter Jobs
      </h1>

      <hr className="mb-3" />

      {/* CLEAR ALL BUTTON */}
      <div className="mb-4">
        <Button 
          onClick={clearAllFilters}
          variant="outline"
          size="sm"
          className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          🗑️ Clear All Filters
        </Button>
      </div>

      {/* FILTER OPTIONS */}
      {filterData.map((data, index) => (
        <div key={index}>

          {/* SECTION TITLE */}
          <h2 className="font-semibold mt-4 mb-2 text-gray-700">
            {data.filterType === "Location" && "📍 "}
            {data.filterType === "Technology" && "💻 "}
            {data.filterType === "Experience" && "⏳ "}
            {data.filterType === "Salary" && "💰 "}
            {data.filterType}
          </h2>

          {/* OPTIONS */}
          {data.array.map((item, indx) => {
            const itemId = `Id${index}-${indx}`;
            const isChecked = selectedFilters[data.filterType]?.includes(item) || false;

            return (
              <div
                key={itemId}
                className="flex items-center space-x-2 my-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition"
              >
                <Checkbox
                  id={itemId}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    console.log(`Checkbox ${itemId} changed to:`, checked);
                    handleChange(data.filterType, item);
                  }}
                  className="accent-purple-600"
                />
                <label
                  htmlFor={itemId}
                  className="cursor-pointer text-sm text-gray-600 hover:text-purple-600"
                >
                  {item}
                </label>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Filter;


