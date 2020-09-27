import React, { useState } from 'react';
import { auth, createUserProfile } from '../firebase/firebase.utils';

import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';

const isEmpty = (state) => {
    const { username, email, password, confirmPassword } = state;
    return !username || !email || !password || !confirmPassword;
}


const handleInputError = (errors, inputName) => {
    return errors.some(error => error.toLowerCase().includes(inputName)) ? 'error' : '';
}

const Register = () => {

    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        errors: []
    });

    
    const isFormValid = () => {
        setInput({...input, errors: []});
        const { password, confirmPassword } = input;
        let error;
    
        if(isEmpty(input)) {
            error = "Fill out all the fields";
            setInput({...input, errors: input.errors.concat(error)});
            return false;
        } else if (password !== confirmPassword) {
            error = "Password and Confirm Password isn't same";
            setInput({...input, errors: input.errors.concat(error)});
            return false;
        } else {
            return true;
        }
    
    }

    
    const handleChange = e => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    

    const handleSubmit = async e => {
        e.preventDefault();

        if(isFormValid()) {
            setInput({...input, errors: []});
            try {
                const user = await auth.createUserWithEmailAndPassword(input.email, input.password);
                
                const additonalData = {
                    displayName: input.username,
                    photoURL: `https://www.gravatar.com/avatar/${md5(input.email)}/?d=identicon`
                }
                user.user.updateProfile(additonalData);

                createUserProfile(user.user, additonalData);
            } catch(error) {
                console.error(error.message);
                setInput({...input, errors: input.errors.concat(error.message)});
            }
        } else {
            
        }

    }

    const displayErrorMessage = () => {
        return input.errors.map((error, i) => <p key={i}>{error}</p>);
    }
    const { errors } = input;

    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{width: 450}}>
                <Header as="h2" icon color="orange" textAlign="center">
                    <Icon name="puzzle piece" color="orange" />
                    Register for DevChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>
                    <Segment stacked>
                        <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="Username" onChange={handleChange} type="text" className={handleInputError(errors, 'username')} autoComplete="username"/>

                        <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email" onChange={handleChange} type="email" className={handleInputError(errors, 'email')} autoComplete="email" />

                        <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={handleChange} type="password" className={handleInputError(errors, 'password')} autoComplete="new-password"/>

                        <Form.Input fluid name="confirmPassword" icon="repeat" iconPosition="left" placeholder="Confirm Password" onChange={handleChange} type="password" className={handleInputError(errors, 'password')} autoComplete="confirm password"/>

                        <Button color="orange" fluid size="large">Submit</Button>
                    </Segment>
                    {input.errors.length ? (
                        <Message>
                            {displayErrorMessage()}
                        </Message>
                    ) : ''}
                    <Message>Already a user? <Link to="/login">Login</Link></Message>
                </Form>
            </Grid.Column>
        </Grid>
    );
}

export default Register;