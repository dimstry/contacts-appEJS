const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { updateContacts, delateContact, cekDuplikat, loadContact, findContact, addContact } = require('./utils/contacts.js');
const { 
  body , 
  check,
  validationResult 
  } = require('express-validator');
  
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;


// mengunakan ejs
app.set("view engine", "ejs");
// therdparty main-layouts
app.use(expressLayouts);

// build in middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
// configurasi flassh
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

app.get('/', (req, res) => {
 // res.sendFile('./index.html', { root : __dirname});
 const siswa = [
    {
     nama: "Dimas",
     kelas: "XII RPL"
    },
    {
     nama: "Kresna",
     kelas: "XII RPL"
    },
   ];
   
 res.render('index', {
   layout: 'layouts/main-layouts',
   nama: "Dimas",
   tittle: "Home",
   siswa
 });
});

app.get('/about', (req, res,next) => {
 res.render('about', {
    layout: 'layouts/main-layouts',
    tittle: "About"
  }); 
});

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', {
    layout: 'layouts/main-layouts',
    tittle: "Contact",
    contacts,
    msg: req.flash('msg'),
  });
});


//halam form tambah data
app.get('/contact/add', (req, res) =>{
  res.render('add-contact', {
   layout: 'layouts/main-layouts',
   tittle: "Tambah Contact", 
  });
});
// proses data contact
app.post('/contact',[
  body('nama').custom((value) =>{
    const duplikat = cekDuplikat(value);
    if(duplikat) {
      throw new Error('Nama sudah digunakan');
    }
    return true;
  }),
  check('email', 'email tidak valid').isEmail(),
  check('noHp', 'no hp tidak valid').isMobilePhone('id-ID'),
  ],(req,res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(404).json({ errors: errors.array() });
    res.render('add-contact', {
      layout: 'layouts/main-layouts',
      tittle: "Tambah Contact", 
      errors: errors.array(),
    });
  }else {
    addContact(req.body);
    // kirim flash masage
    req.flash('msg', 'data berhasil di tambah');
    res.redirect('/contact');
  }
});

// proses delate contact

app.get('/contact/delate/:nama', (req,res) => {
  const contact = findContact(req.params.nama);
  //jika contact tidak ada
  if(!contact) {
    res.status(404);
    res.send('<h1>404</h1>');
  }else {
    delateContact(req.params.nama);
      // kirim flash masage
    req.flash('msg', 'data berhasil di Hapus');
    res.redirect('/contact');
  }
});


// form ubah data contact
app.get('/contact/edit/:nama', (req, res) =>{
  const contact = findContact(req.params.nama);
  
  res.render('edit-contact', {
   layout: 'layouts/main-layouts',
   tittle: "Edit Contact", 
   contact,
  });
});

//proses ubah data

app.post('/contact/update',[
  body('nama').custom((value,{req}) =>{
    const duplikat = cekDuplikat(value);
    if(value !== req.body.oldNama && duplikat) {
      throw new Error('Nama sudah digunakan');
    }
    return true;
  }),
  check('email', 'email tidak valid').isEmail(),
  check('noHp', 'no hp tidak valid').isMobilePhone('id-ID'),
  ],(req,res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(404).json({ errors: errors.array() });
    res.render('edit-contact', {
      layout: 'layouts/main-layouts',
      tittle: "Ubah Contact", 
      errors: errors.array(),
      contact: req.body,
    });
  }else {
    
    updateContacts(req.body);
    // kirim flash masage
    req.flash('msg', 'data berhasil di ubah');
    res.redirect('/contact');
  }
});



//halaman detail
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('detail', {
    layout: 'layouts/main-layouts',
    tittle: "Detail Contact",
    contact
  });
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404</h1>');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

