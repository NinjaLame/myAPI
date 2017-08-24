import {
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';
import Db from './db';

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'This represents a Person',
    fields:()=>{
        return{
            id: {
                type: GraphQLInt,
                resolve(person){
                    return person.id;
                 }
            },
            firstName: {
                type: GraphQLString,
                resolve(person){
                    return person.firstName;
                }
            },
            lastName: {
                type: GraphQLString,
                resolve(person){
                    return person.lastName;
                }
            },
            email: {
                type: GraphQLString,
                resolve(person){
                    return person.email;
                }
            },
            post: {
                type: new GraphQLList(Post),
                resolve(person) {
                    return person.getPosts();
                }
            }
        }
    }
});

const Post = new GraphQLObjectType({
    name: 'post',
    description: 'This is a Post',
    fields: ()=> {
        return{
            id: {
                type: GraphQLInt,
                resolve(post){
                    return post.id;
                 }
            },
            title: {
                type: GraphQLString,
                resolve(post){
                    return post.title;
                }
            },
            content: {
                type: GraphQLString,
                resolve(post){
                    return post.content;
                }
            },
            person: {
                type:  Person,
                resolve(post){
                    return post.getPerson();
                }
            }
        }
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'This is a root query',
    fields: ()=>{
        return{
            people: {
                type: new GraphQLList(Person),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    email: {
                        type: GraphQLString
                    }

                },
                resolve(root, args){
                    return Db.models.person.findAll({where: args});
                }
            },
            post: {
                type: new GraphQLList(Post),
                resolve(root,args){
                    return Db.models.post.findAll({ehwew: args});
                }
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'function to create stugg',
    fields(){
        return{
            addPerson:{
                type: Person,
                args: {
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args){
                    return Db.models.person.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email.toLowerCase()
                    });
                }
            },
            deletPerson:{
                type: Person,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args){
                    return Db.models.person.destroy({
                       where:{ email: args.email}
                    });
                }
            },
            editPerson:{
                type: Person,
                args: {
                    firstName: {
                        type: GraphQLString
                    },
                    lastName:{
                        type: GraphQLString
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args){
                    return Db.models.person.update({
                       where:{ email: args.email},
                    }).then(()=>{
                        firstName: args.firstName
                        lastName: args.lastName
                        email: args.email.toLowerCase()
                    });
                }
            }
        }
    }
});
const Schema = new GraphQLSchema({
    query: Query,
    mutation : Mutation
});

export default Schema;