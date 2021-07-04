_____________________________________________________________________
### Authentication

**Install bcryptjs to get hash of user password bcrypt.hash params: password + salt + callback(return error and hash value)** <br>
`npm i bcryptjs`

_`bcrypt.genSalt(10, (err, salt) => {bcrypt.hash(request.body.password, salt, (err, hash) => {}}`_

**Install jsonwebtoken to create Bearer token for authenticate middleware** <br>
`npm i jsonwebtoken`

_`bcrypt.compare(request.body.password, user.password, (err, result) => {})`_

_`jwt.sign(userTokenData, secretOrPrivateKey, options, (err, token) => {})`_

_____________________________________________________________________
### Database

**Get NPM package of PostgreSQL** <br>
`npm i pg`

**Get NPM package of sequelize and sequelize-cli**
`npm i sequelize` or
`npm i sequelize-cli`

**Additional params for connecting in config.json**  <br>
_`"protocol": "postgres", "dialectOptions": {"ssl": {"require": true, "rejectUnauthorized": false}},"operatorsAliases": 0`_

**Connection string to Heroku database** <br>
**`password:`** `ae8834f9146ed515cfc4ca1a3cbb9e9b654ee27db556d9035d6342f37f5b176d` 

**`connection string:`** `jdbc:postgresql://ec2-52-5-247-46.compute-1.amazonaws.com:5432/d7aa72melijb0h`

**Init sequelize cli to create fiels and folders structure** <br>
`npx sequelize-cli init`

**Generate data model with Table name and attributes with data types** <br>
`npx sequelize model:generate --name Post --attributes title:string,categoryId:integer,content:text,imageUrl:string,userId:integer`

**Create table and attributes in database via models from previous steps** <br>
`npx sequelize-cli db:migrate`

**Create seeders** <br>
`npx sequelize db:seed --seed all or 'filename'`