import { useNavigate }  from "react-router-dom";
import {useState} from "react";

function Event() {
    const navigate = useNavigate();

    const [event, setEvent] = useState ({
        date:"",
        name:"",
        kind:"",
        place:"",
        numberOfGuests:"",
        conditions:"",
    })

    const handlechange = (e) => {
        const {name, value} = e.darget;
        setEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };
return (
<div>
    <h2>Event</h2>
    <button onClick={() => navigate('/דף בית')}>דף בית</button>

   </div>
)
}

export default Event;