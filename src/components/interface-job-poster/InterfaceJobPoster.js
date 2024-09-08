import '../../App.css';
import '../../assets/css/Modals.css';
import { useNavigate } from 'react-router-dom';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// use fa user-check for applicants
// use fa user-plus for recruit talents
// renraku portal
import { faUserCheck, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const InterfaceJP = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <TopNavbar /> */}

      {/* <StartModal isModalVisible={isModalVisible} closeModal={closeModal} /> */}

      <div className="main_container_interface">
        <div className="lg_container">
          {/* now for the user-check user-plus and renrakuportal */}
          <div className="button_row">
            <div className="button-item">
              <div className="button" onClick={() => navigate('/applicants')}>
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
              <div className="button_displaytext">応募者</div>
            </div>
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/recruit_talents')}
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div className="button_displaytext">募集ポータル</div>
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
export default InterfaceJP;
