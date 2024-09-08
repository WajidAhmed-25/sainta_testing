import '../../App.css';
import '../../assets/css/Modals.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdBadge, // use fa idBadge for personal profile
  faBinoculars, // then fa binoculars for job search
  faNetworkWired, // hten network-wired for renraku portal
} from '@fortawesome/free-solid-svg-icons';

const InterfaceJS = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <TopNavbar /> */}

      {/* <StartModal isModalVisible={isModalVisible} closeModal={closeModal} /> */}

      <div className="main_container_interface">
        <div className="lg_container">
          {/* now for the personalprofile jobsearch and renrakuportal */}
          <div className="button_row">
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/personal_profile')}
              >
                <FontAwesomeIcon icon={faIdBadge} />
              </div>
              <div className="button_displaytext">プロフィール</div>
            </div>
            <div className="button-item">
              <div className="button" onClick={() => navigate('/job_search')}>
                <FontAwesomeIcon icon={faBinoculars} />
              </div>
              <div className="button_displaytext">求人検索</div>
            </div>
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/renraku_portal')}
              >
                <FontAwesomeIcon icon={faNetworkWired} />
              </div>
              <div className="button_displaytext">連絡ポータル</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InterfaceJS;
