import React, {useState} from 'react';
import {Grid, Header, Icon, Button, Message, Form, Segment} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import { auth } from '../firebase/firebase.utils';
const Login = () => {
    const [ input, setInput ] = useState({
        email: '',
        password: '',
        errors: []
    });

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value});
    }

    const handleInputError = (errors, inputName) => {
        return errors.some(error => error.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    const displayErrorMessage = () => {
        return input.errors.map((error, i) => <p key={i}>{error}</p>);
    }

    const isValid = (email, password) => {
        return email && password;
    }

    const handleSubmit = e => {
        e.preventDefault();
        const {email, password, errors} = input;
        if(isValid(email, password)){
            setInput({...input, errors: []});
            
            
            auth.signInWithEmailAndPassword(email, password).then((user) => console.log('singed in'))
            .catch(error => {
                console.error(error.message);
                setInput({...input, errors: errors.concat(error.message)});
            });
        }
    }

    const {errors} = input;
    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{maxWidth: 450}} >
                <Header as="h1" icon color="violet" textAlign="center">
                    <Icon name="code branch" color="violet" />
                    Login to DevChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>
                    <Segment stacked>
                        <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email" onChange={handleChange} type="email" className={handleInputError(errors, 'email')} autoComplete="email" />

                        <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={handleChange} type="password" className={handleInputError(errors, 'password')} autoComplete="new-password"/>

                        <Button color="orange" fluid size="large">Submit</Button>
                    </Segment>
                    {input.errors.length ? (
                        <Message>
                            {displayErrorMessage()}
                        </Message>
                    ) : ''}
                    <Message>Don't have an user account? <Link to="/register">Register</Link></Message>
                </Form>
            </Grid.Column>
        </Grid>
    );
}

export default Login;