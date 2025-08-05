import '../style/pages.css';
import Slider from '../components/Slider';
import Sliderup from '../components/Sliderup';
import FirstTable from '../components/FirstTable';
import '../style/tables.css';

function Homepage() {
  return (
    <div className="wrapper">
      <Sliderup />
      <div className="homepage-page">
        <div className="homepage-container">
          <FirstTable />
        </div>
      </div>
      <Slider />
    </div>
  );
}

export default Homepage;
