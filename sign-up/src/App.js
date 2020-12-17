import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import schema from './validation/formSchema'
import './index.css'
import User from './User'
import UserForm from './UserForm'

//////////////// INITIAL STATES ////////////////
//////////////// INITIAL STATES ////////////////
//////////////// INITIAL STATES ////////////////
const initialFormValues = {
  ///// TEXT INPUTS /////
  name: '',
  email: '',
  password: '',


  ///// CHECKBOXES /////
  terms: false,

}
const initialFormErrors = {
  name: '',
  email: '',
  password: '',
  terms: '',
}
const initialUsers = []
const initialDisabled = true


export default function App() {
  //////////////// STATES ////////////////
  //////////////// STATES ////////////////
  //////////////// STATES ////////////////
  const [users, setUsers] = useState([initialUsers])          // array of user objects
  const [formValues, setFormValues] = useState(initialFormValues) // object
  const [formErrors, setFormErrors] = useState(initialFormErrors) // object
  const [disabled, setDisabled] = useState(initialDisabled)       // boolean

  //////////////// HELPERS ////////////////
  //////////////// HELPERS ////////////////
  //////////////// HELPERS ////////////////
  const getUsers = () => {
    // 🔥 STEP 5- IMPLEMENT! ON SUCCESS PUT USERS IN STATE
    //    helper to [GET] all users from `http://buddies.com/api/friends`
    axios
    .get('https://reqres.in/api/users')
    .then((res) => {
      const userData = [res.data.data];
      setUsers(res.data.data)
      console.log(userData);
    })
    .catch((err) => console.log(err, 'it broke'));
  }

  const postNewUser = newUser => {
    axios
    .post('https://reqres.in/api/users', newUser)
    .then(res => {
      setUsers([res.data, ...users])
      setFormValues(initialFormValues)
      console.log(res.data)
    })
    .catch(err =>  console.log(err, 'it broke again'))
  }


  const inputChange = (name, value) => {
    // yup.reach will allow us to reach iinto the schema & test only one part
    // we give reach the schema as the first arg & the test as the second
    Yup
    .reach(schema, name) // get to this part of the schema
    .validate(value) // run validate using the value & validate the value
    .then(() => {
      // happy path, success & clear error
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    })
    // if the validation is unsuccessful, we can set the error msg to the msg returned when we made our schema
    .catch(err => {
      setFormErrors({
        ...formErrors,
        // validation error from the schema
        [name]: err.errors[0],
      });
    })
    setFormValues({
      ...formValues,
      [name]: value 
    })
  }

  const formSubmit = () => {
    const newUser = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      password: formValues.password.trim(),
    }

    postNewUser(newUser);
  }

  //////////////// SIDE EFFECTS ////////////////
  //////////////// SIDE EFFECTS ////////////////
  //////////////// SIDE EFFECTS ////////////////
  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    schema.isValid(formValues).then(valid => {
      setDisabled(!valid);
    });
  }, [formValues]);

  return (
    <div className='container'>
      <header><h1>User Sign Up</h1></header>

      <UserForm
        values={formValues}
        change={inputChange}
        submit={formSubmit}
        disabled={disabled}
        errors={formErrors}
      />

      {
        users.map(user => {
          return (
            <User key={user.id} details={user} />
          )
        })
      }
    </div>
  )
}


