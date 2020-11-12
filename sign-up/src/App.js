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
  const [users, setUsers] = useState(initialUsers)          // array of user objects
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
    .get('http://reqres.in/api/users')
    .then((res) => {
      setUsers(res.data);
      console.log(res.data)
    })
    .catch((err) => console.log(err, 'it broke'))

  }

  const postNewUser = newUser => {
    // 🔥 STEP 6- IMPLEMENT! ON SUCCESS ADD NEWLY CREATED FRIEND TO STATE
    //    helper to [POST] `newUser` to `http://buddies.com/api/friends`
    //    and regardless of success or failure, the form should reset
    axios
    .post('http://reqres.in/api/users', newUser)
    .then(res => {
      setUsers([res.data, ...users])
      setFormValues(initialFormValues)
    })
    .catch(err =>  console.log(err, 'it broke again'))
  }

  //////////////// EVENT HANDLERS ////////////////
  //////////////// EVENT HANDLERS ////////////////
  //////////////// EVENT HANDLERS ////////////////
  const inputChange = (name, value) => {
    // 🔥 STEP 10- RUN VALIDATION WITH YUP
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
      [name]: value // NOT AN ARRAY
    })
  }

  const formSubmit = () => {
    const newUser = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      password: formValues.password.trim(),
    }
    // 🔥 STEP 8- POST NEW USER USING HELPER
    postNewUser(newUser);
  }

  //////////////// SIDE EFFECTS ////////////////
  //////////////// SIDE EFFECTS ////////////////
  //////////////// SIDE EFFECTS ////////////////
  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    // 🔥 STEP 9- ADJUST THE STATUS OF `disabled` EVERY TIME `formValues` CHANGES
    /* Each time the form value state is updated, check to see if it is valid per our schema. 
  This will allow us to enable/disable the submit button.*/
    /* We pass the entire state into the entire schema, no need to use reach here. 
    We want to make sure it is all valid before we allow a user to submit
    isValid comes from Yup directly */
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


