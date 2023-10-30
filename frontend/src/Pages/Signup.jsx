import React, { useState } from 'react';
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [gender, setGender] = useState("");
    const [isMarried, setIsMarried] = useState(false);
    const [age, setAge] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const postObj = {
            name: name,
            email: email,
            password: password,
            city: city,
            gender: gender,
            is_married: isMarried,
            age:age 
        }

        axios.post("https://elegant-rose-prawn.cyclic.app/users/register", postObj, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err));

    }

    
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input onChange={(e) => {setName(e.target.value)}} type="text" placeholder='Name' />
            <input onChange={(e) => {setEmail(e.target.value)}} type="email" placeholder='Email' />
            <select onChange={(e) => {setGender(e.target.value)}} >
                <option value="">Choose one</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input onChange={(e) => {setPassword(e.target.value)}} type="password" placeholder='Password' />
            <input onChange={(e) => {setAge(e.target.value)}} type="number" placeholder='Age' />
            <input onChange={(e) => {setCity(e.target.value)}} type="text" placeholder='City' />
            <select onChange={(e) => {setIsMarried(e.target.value == "true"? true: false)}}>
                <option value="">Choose one</option>
                <option value="true">True</option>
                <option value="false">false</option>
            </select>
            <input type="submit" value={"Reginter"} />
        </form>
    </div>
  )
}

export default Signup