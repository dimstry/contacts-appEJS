const fs = require('fs');


const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
// membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]' , 'utf-8');
}
// cari semua data
const loadContact = () => {
  const file = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(file);
  return contacts;
};

// cari 1 contacts berdasarkan nama
const findContact = (nama) =>{
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
};

// menimpa file contacts json dengan data baru
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// function add contact baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};
// cek nama duplikat
const cekDuplikat = (nama) => {
  const contact = loadContact();
  return contact.find((contact) => contact.nama === nama);
};

// hapus contact berdasarkan nama
const delateContact= (nama) => {
  const contacts = loadContact();
  const filterContact =contacts.filter((contact) => 
  contact.nama != nama);
  saveContacts(filterContact);
};

//untuk mengubah contact
const updateContacts = (contactBaru) => {
  const contacts = loadContact();
  //hilangkan comtact nama yg namanya sama dengan old mama
  const filterContact =contacts.filter((contact) => 
  contact.nama != contactBaru.oldNama);
  
  delete contactBaru.oldNama;
  filterContact.push(contactBaru);
  saveContacts(filterContact);
};


module.exports = { updateContacts, cekDuplikat, loadContact, findContact, addContact,delateContact };