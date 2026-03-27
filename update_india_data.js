const fs = require('fs');
let data = fs.readFileSync('lib/mock-data.ts', 'utf8');

// Replace Pricing Lanes
data = data.replace(/Shanghai", destination: "Los Angeles"/g, 'Mumbai", destination: "Delhi"');
data = data.replace(/Rotterdam", destination: "New York"/g, 'Chennai", destination: "Kolkata"');
data = data.replace(/Singapore", destination: "Hamburg"/g, 'Bangalore", destination: "Hyderabad"');
data = data.replace(/Dubai", destination: "Mumbai"/g, 'Kochi", destination: "Mumbai"');
data = data.replace(/Tokyo", destination: "Sydney"/g, 'Pune", destination: "Ahmedabad"');
data = data.replace(/Busan", destination: "Vancouver"/g, 'Surat", destination: "Jaipur"');
data = data.replace(/Hong Kong", destination: "London"/g, 'Lucknow", destination: "Kanpur"');
data = data.replace(/Chennai", destination: "Durban"/g, 'Chennai", destination: "Visakhapatnam"');
data = data.replace(/Shenzhen", destination: "Jakarta"/g, 'Indore", destination: "Bhopal"');
data = data.replace(/Lagos", destination: "Lisbon"/g, 'Patna", destination: "Ranchi"');

// Replace Decisions Routes & Reasons
data = data.replace(/Gulf Direct/g, 'Konkan Coastal');
data = data.replace(/Suez-Med Express/g, 'Western Freight Corridor');
data = data.replace(/HK-London Direct/g, 'Delhi-Mumbai Expressway');
data = data.replace(/I-55 South/g, 'NH-44 South');
data = data.replace(/I-65/g, 'NH-48');
data = data.replace(/North Pacific/g, 'Bay of Bengal Route');
data = data.replace(/South China Sea Direct/g, 'Arabian Sea Direct');
data = data.replace(/Trans-Pacific Fast/g, 'Golden Quadrilateral Fast');
data = data.replace(/West Africa-Iberia/g, 'East Coast Route');
data = data.replace(/Mombasa hub/g, 'JNPT Hub');
data = data.replace(/Port Said/g, 'Mundra Port');
data = data.replace(/Canary Islands/g, 'Andaman & Nicobar Islands');

// Replace Warehouses Ext
data = data.replace(/Pacific Hub - Los Angeles/g, 'Western Hub - Mumbai');
data = data.replace(/Atlantic Gateway - Rotterdam/g, 'Eastern Gateway - Kolkata');
data = data.replace(/Asia Central - Singapore/g, 'Southern Central - Bangalore');
data = data.replace(/Middle East Hub - Dubai/g, 'Central Hub - Nagpur');

// Replace Fraud & Risks
data = data.replace(/Port of Aden/g, 'Port of Kochi');
data = data.replace(/Pacific weather patterns/g, 'Monsoon weather patterns');
data = data.replace(/South Atlantic/g, 'Indian Ocean');

// Export mapping (just in case we missed some, adding exact string replacements)
data = data.replace(/Los Angeles/g, 'Mumbai');
data = data.replace(/Rotterdam/g, 'Kolkata');
data = data.replace(/Singapore/g, 'Bangalore');
data = data.replace(/Dubai/g, 'Nagpur');

fs.writeFileSync('lib/mock-data.ts', data);
console.log("Mock data updated to India successfully.");
