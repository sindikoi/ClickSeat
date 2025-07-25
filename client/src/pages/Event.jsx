import { useNavigate }  from "react-router-dom";

function Event() {
    const navigate = useNavigate();
return (
<div>
    <h2>Event</h2>
    <button onClick={() => navigate('/דף בית')}>דף בית</button>

   </div>
)
}

export default Event;