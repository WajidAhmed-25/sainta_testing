import '../../App.css';
import '../../assets/css/Modals.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // fa project diagram, fa chartline , networkwired for renraku going to be into
  faProjectDiagram,
  faChartLine,
  faNetworkWired,
} from '@fortawesome/free-solid-svg-icons';

const InterfaceRabo = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <TopNavbar /> */}

      {/* <StartModal isModalVisible={isModalVisible} closeModal={closeModal} /> */}

      <div className="main_container_interface">
        <div className="lg_container">
          {/* now for the project information, stages of project, renraku portal */}
          <div className="button_row">
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/project_information')}
              >
                <FontAwesomeIcon icon={faProjectDiagram} />
              </div>
              <div className="button_displaytext">プロジェクト情報</div>
            </div>
            <div className="button-item">
              <div
                className="button"
                onClick={() => navigate('/projectstage-rb')}
              >
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className="button_displaytext">プロジェクト段階</div>
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
export default InterfaceRabo;
