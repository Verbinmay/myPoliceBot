db = db.getSiblingDB("policeBot"); 

db.createUser({
  user: "mark",
  pwd: "ff",
  roles: [
    { role: "readWrite", db: "policeBot" }, 
  ],
});
