import Sequelize from 'sequelize';
import _ from 'lodash';
import faker from 'faker';
const Conn = new Sequelize(
    'demo',
    'root',
    'kancut00',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

const Person = Conn.define('person',{
    firstName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            isEmail: true
        }
    }
});

const Post = Conn.define('post',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Relationships
Person.hasMany(Post);
Post.belongsTo(Person);

Conn.sync({force:true}).then(()=>{
    _.times(10,()=>{
        return Person.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email()
        }).then(person=>{
            return person.createPost({
                title: 'sample title by '+person.firstName,
                content: 'This is a sample article'
            });
        });
    })
});

export default Conn;
