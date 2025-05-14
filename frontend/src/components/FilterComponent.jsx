import React from 'react';

const FilterComponent = ({
    hives, locations,
    selectedHive, setSelectedHive,
    selectedLocation, setSelectedLocation,
    startDate, setStartDate,
    endDate, setEndDate
}) => {
    return (
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            {/* Hive Selection */}
            <div>
                <label>Hive: </label>
                <select value={selectedHive} onChange={(e) => setSelectedHive(e.target.value)}>
                    <option value="">Select Hive</option>
                    {hives.map(hive => (
                        <option key={hive} value={hive}>{hive}</option>
                    ))}
                </select>
            </div>

            {/* Location Selection */}
            <div>
                <label>Location: </label>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                    <option value="">Select Location</option>
                    {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>

            {/* Start Date */}
            <div>
                <label>Start Date: </label>
                <input
                    type="date"
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                />
            </div>

            {/* End Date */}
            <div>
                <label>End Date: </label>
                <input
                    type="date"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                />
            </div>
        </div>
    );
};

export default FilterComponent;
