import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import { Auth } from "aws-amplify";
import "./Signup.css";

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
        country: "",
        state: "",
        phoneNumber: "",
        mobileNumber: "",
        confirmationCode: "",
    });
    const history = useHistory();
    const [newUser, setNewUser] = useState(null);
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.firstName.length > 0 &&
            fields.lastName.length > 0 &&
            fields.userName.length > 0 &&
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword &&
            fields.dob.length > 0 &&
            fields.country.length > 0 &&
            fields.state.length > 0 &&
            fields.phoneNumber.length > 0 &&
            fields.mobileNumber.length > 0
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
                firstName: fields.firstName,
                lastName: fields.lastName,
                userName: fields.userName,
                dob: fields.dob,
                country: fields.country,
                state: fields.state,
                phoneNumber: fields.phoneNumber,
                mobileNumber: fields.mobileNumber,

            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);

            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode" size="lg">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <Form.Text muted>Please check your email for the code.</Form.Text>
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </Form>
        );
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="firstName" size="lg">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={fields.firstName}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="lastName" size="lg">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={fields.lastName}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="userName" size="lg">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={fields.userName}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="email" size="lg">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="password" size="lg">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword" size="lg">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.confirmPassword}
                    />
                </Form.Group>
                <Form.Group controlId="dob" size="lg">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type="date"
                        max="2000-12-31"
                        onChange={handleFieldChange}
                        value={fields.dob}
                    />
                </Form.Group>
                <Form.Group controlId="country" size="lg">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={fields.country}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="state" size="lg">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={fields.state}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="phoneNumber" size="lg">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        value={fields.phoneNumber}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="mobileNumber" size="lg">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        value={fields.mobileNumber}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
            </Form>
        );
    }

    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}