export const fetchReadings = (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`http://localhost:5000/api/readings?${query}`).then(res => res.json());
  };
  
  export const fetchAverages = (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`http://localhost:5000/api/averages?${query}`).then(res => res.json());
  };
  
  export const fetchMonthlyAverages = (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`http://localhost:5000/api/monthlyaverages?${query}`).then(res => res.json());
  };
  
  export const fetchMinMax = (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`http://localhost:5000/api/minmax?${query}`).then(res => res.json());
  };
  