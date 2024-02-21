import './chat.css';
import React, { useState, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import useOutsideClick from '../../components/useOutsideClick';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';

function ChatPage() {
  const navigate = useNavigate();
  // add state for input and chat log
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState('');
  // const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("GPT-4")
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message:"Hello, how can I help you today?"
  },{
    user: "me",
    message: "I would like to converse with llms"
  }]);
  const { isLoggedIn, setIsLoggedIn, userToken } = useContext(AuthContext);

  function clearChat() {
    setChatLog([]);
  }

  const models = ["GPT-4", "GPT-3", "GPT-2", "GPT-1"];

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedChatLog = [...chatLog, { user: "me", message: `${input}` }];
    setChatLog(updatedChatLog);
    setInput("");
    // fetch response to the api combing the chat log array of messages and sending it as a message to localhost:3080 as a post request
    // Send the user's message to the server and wait for the response
    try {
      const response = await fetch('http://localhost:3080/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ message: input })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Add the server's response to the chat log
      setChatLog([...updatedChatLog, { user: "gpt", message: data.message }]);
    } catch (error) {
      console.error("Failed to submit the message:", error);
    }
  }

  // Placeholder function to handle profile click - to be implemented
  const handleProfileClick = () => {
    console.log('Profile area clicked');
    // Future implementation will go here
  };

  const handleSettingsClick = () => {
    // Placeholder for future settings window toggle logic
    setShowSettings(!showSettings);
    console.log('Settings cog clicked');
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
  
    // Reset authentication states
    setIsLoggedIn(false);
  
    // Redirect to the home page
    navigate('/');
  };

  // This useEffect hook will handle clicks outside of the dropdown
  const settingsRef = useRef(null);
  useOutsideClick(settingsRef, showSettings, () => setShowSettings(false));

  return (
    <div className="App">
    <aside className="sidemenu">
      <div className="side-menu-button" onClick = {clearChat} >
        <span>+</span>
        New Chat
      </div>
      <div className="models-title">
        Models
      </div>
      <div className="models">
        <select onChange = {(e)=>{setCurrentModel(e.target.value)}}>
          {models.map((model, index) => (
            <option key={index} value={model}>{model}</option>
          ))}
        </select>
      </div>
      <div ref={settingsRef} className="profile-container">
        <div className="profile-area" onClick={handleProfileClick}>
          My Profile {/* This will later be updated to an icon or user's avatar */}
        </div>
        <FontAwesomeIcon icon={faCog} className="settings-cog" onClick={handleSettingsClick} />
        {showSettings && (
          <div className="settings-dropdown">
            <div className="settings-item" onClick={() => console.log('Go to All Settings')}>
              Go to All Settings
            </div>
            <div className="settings-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
      
    </aside>
    <section className="chatbox">
    <div className="chat-log">
      {chatLog.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
      <div className="chat-input-holder">
        <form onSubmit={handleSubmit}>
        <input rows = "1" value = {input} onChange={(e) => setInput(e.target.value)} className="chat-input-textarea" placeholder="Message your Chatbot...">
        </input>
        </form>
      </div>
    </section>
      
    </div>
  );
}

const ChatMessage = ({message}) => {
  return (
    <div className={`chat-message ${message.user === "gpt" ? "llm" : ""}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" ? "llm" : ""}`}>
          {message.user === "gpt" && <svg
              version="1.1"
              id="svg1"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
          >
            <defs
              id="defs1" />
            <g
              id="g1">
              <path
                style={{ fill: "#030303" , stroke:"none" }}
                d="m 496.97662,127.41872 v 153 c 0,15.40869 7.7128,45.46606 -17,45.94446 -24.54447,0.47516 -18.07252,-28.74823 -17.99925,-43.94446 0.2407,-49.91504 0.99924,-100.00128 0.99924,-150 -19.09525,0.8219 -38.50348,9.13983 -56,16.20062 -5.25964,2.12256 -16.07687,5.23041 -18.39661,10.9043 -2.91189,7.12225 -0.60339,19.23987 -0.60339,26.89508 v 61 180 57 c 0,7.06232 2.34464,15.11591 0.91666,22 -3.99775,19.2724 -31.91788,21.04761 -36.52237,1 -2.21381,-9.63867 1.48514,-21.1886 1.60186,-31 0.30527,-25.65857 0.004,-51.33942 0.004,-77 v -86 -134 c -17.58243,5.6142 -34.30487,26.28448 -47,39 -46.59334,46.66821 -78.94943,114.11987 -85.07484,180 -1.95417,21.01752 -2.02631,41.8681 -1.9244,63 0.0214,4.44531 -0.84564,19.19977 4.14739,20.68213 11.90333,3.53393 29.4125,0.31787 41.85185,0.31787 3.31555,0 10.63245,1.35083 12.97223,-1.60339 3.71225,-4.68714 1.02777,-19.55097 1.02777,-25.39661 v -70 c 0,-11.30634 -3.54388,-27.32196 -0.19598,-38 2.81598,-8.98145 13.89776,-16.09631 23.19598,-13.19598 18.63409,5.81231 12,25.25171 12,39.19598 v 91 c 0,13.32544 2.48981,29.5202 -5.78937,40.99615 -8.49023,11.7685 -21.11673,12.00385 -34.21063,12.00385 h -48 c 7.78806,33.97168 22.44922,67.61145 41.05322,97 15.02747,23.73871 35.44562,44.89868 41.94678,73 11.88916,-5.59058 22.14658,-22.3996 31.08951,-32 24.78387,-26.60583 48.63321,-56.15088 75.91049,-80.15509 8.4549,-7.44037 17.90845,-14.12347 29,-16.94904 3.77176,-0.96093 14.57773,-0.51733 16.39661,-4.21374 4.64251,-9.43475 0.60339,-30.13623 0.60339,-40.68213 0,-16.67737 -1.74646,-34.44818 0.28629,-51 1.21606,-9.90204 6.01358,-18.46259 7.71371,-28 -7.22498,0 -14.82266,-0.67444 -22,0.18445 -6.55365,0.78424 -12.57315,3.34192 -19,0.12726 -15.48993,-7.74793 -14.89487,-28.88745 1,-35.77857 9.69415,-4.20282 26.27951,0.46686 37,0.46686 4.20074,0 9.98811,1.03711 13.57171,-1.60339 6.1816,-4.55457 10.8934,-12.57209 15.8558,-18.39661 14.4378,-16.94611 28.6114,-37.17938 47.5725,-49.3009 8.1665,-5.22077 18.375,-7.44867 28,-7.68445 3.6777,-0.0901 12.3979,1.63226 14.9722,-1.61804 3.601,-4.54663 1.0278,-18.73987 1.0278,-24.39661 0,-19.96405 0.9285,-40.07697 -0.04,-60 -0.5966,-12.27271 -3.9238,-23.51434 10.0401,-30.54401 10.9098,-5.49212 24.3577,2.87543 25.8148,14.54401 0.6403,5.12695 -1.1886,9.92737 -1.0656,15 0.5411,22.31622 0.2508,44.67224 0.2508,67 0,13.51764 0.8185,28.32343 -7.2207,40 -12.7612,18.53522 -31.2818,12.15405 -49.7793,17.159 -16.1583,4.37201 -35.0615,25.48632 -41,40.841 9.8191,-2.33771 20.9441,-1 31,-1 h 63 c 9.8798,0 21.1628,1.5304 30.8951,-0.14813 5.5969,-0.96533 8.5059,-10.91986 12.1983,-14.83722 8.9945,-9.54267 22.6758,-15.60486 35.9066,-13.71448 40.2129,5.74555 48.8047,56.63709 17,78.89966 -12.7058,8.8938 -32.6239,7.45795 -45,-1.24384 -5.877,-4.1322 -10.4549,-13.23944 -18,-13.89734 -35.0767,-3.05859 -71.7748,-0.0587 -107,-0.0587 -9.6416,0 -30.5039,-3.90662 -37.8148,3.14813 -10.3615,9.99842 -11.1852,26.45447 -11.1852,39.85187 v 79 c 10.5966,0 25.5655,-6.54688 35,-2.08026 15.9426,7.54779 15.6594,30.46338 -0.9992,36.93902 -9.8482,3.82831 -24.3323,-1.85876 -35.0008,-1.85876 -20.28703,0 -40.91844,-1.97424 -58.00001,11.04016 -7.26462,5.53485 -12.81891,13.06439 -18.72916,19.95984 -4.60818,5.37634 -10.30261,10.5199 -13.27084,17 h 214.00001 c 13.9495,0 28.0679,0.63715 42,-0.0402 5.1056,-0.24817 9.8835,-2.87854 15,-2.69592 17.8199,0.63592 24.6565,23.14929 11.9568,34.52233 -8.1357,7.28577 -15.5374,3.7129 -24.9568,3.82251 -18.987,0.22099 -37.9942,0.39128 -57,0.39128 H 452.97661 c -23.67432,0 -53.39203,-4.77832 -76,2.67053 -18.77121,6.18469 -31.94211,26.73816 -44.42053,41.32947 -4.36658,5.10596 -11.74542,11.23267 -13.27625,18 -3.32019,14.67761 0.76697,32.08008 0.69602,47 -0.0452,9.50751 -3.86216,29.4975 1.02853,37.78705 2.95239,5.00415 12.0799,7.36206 16.97223,10.07403 15.12134,8.38233 35.02914,23.0763 52,26.13892 0,-20.8429 -2.56314,-43.75159 3.15509,-64 5.01715,-17.76587 18.58371,-30.93347 30.7554,-44 13.22708,-14.19946 26.07846,-29.24622 45.08951,-35.64429 24.18081,-8.13794 53.79251,-4.35571 79.00001,-4.35571 34.6653,0 69.3352,-0.16638 104,7.3e-4 11.5442,0.0557 25.8631,6.30066 25.6412,19.99927 -0.1603,9.88818 -10.2911,17.93921 -19.6412,17.96991 -34.6389,0.11365 -70.058,-1.96991 -105,-1.96991 -26.8273,0 -60.5654,-5.70947 -85.00001,7.3233 -10.20065,5.44074 -17.23032,14.31757 -24.91434,22.6767 -7.29742,7.9386 -14.15014,16.39966 -16.92978,27 -5.44711,20.77313 -1.15588,47.54529 -1.15588,69 l 77.00001,12 v -62 c -0.012,-7.4046 -3.1673,-14.63141 -1.6952,-22 1.9793,-9.90735 12.617,-17.78894 22.6952,-15.60956 7.7055,1.66626 14.1278,8.76953 14.8951,16.60956 0.639,6.53003 -1.8606,12.52094 -1.8943,19 -0.1111,21.33203 -8e-4,42.6676 -8e-4,64 17.8335,0 35.4784,-3.70581 53,-6.75 4.7375,-0.82312 14.7673,-0.84912 17.9722,-4.97766 3.8833,-5.00232 0.8906,-20.07227 1.0424,-26.27234 0.4178,-17.05518 7.784,-33.26477 22.9854,-42.12347 12.5807,-7.33149 26.9173,-6.87653 41,-6.87653 h 57 c 21.9397,0 43.512,-6.47247 50.5602,-30 6.1247,-20.44501 0.6804,-43.02429 2.4984,-64 0.9035,-10.42371 13.6768,-14.03296 16.7655,-23 2.0076,-5.82825 -12.5768,-18.57532 -16.8241,-22 v -1 c 5.4296,-4.37805 14.101,-11.94592 15.6968,-19 2.3823,-10.53113 -4.6617,-29.5188 1.331,-38.58179 2.6347,-3.98462 10.7788,-5.73584 14.9722,-7.64892 14.125,-6.44397 29.5088,-11.09149 43,-18.76929 -4.1364,-13.06689 -14.6674,-26.36597 -21.9498,-38 -12.7372,-20.34814 -24.9313,-41.19446 -36.9006,-62 -4.6704,-8.11841 -12.0654,-17.00519 -14.7514,-26 -2.6153,-8.75812 5.6482,-24.91895 7.341,-34 4.3366,-23.26416 6.2403,-47.46606 2.8326,-71 -11.6411,-80.39374 -68.8503,-145.61908 -138.5718,-183.30865 -25.3969,-13.72889 -58.6787,-27.44867 -88,-27.69135 0,37.62897 -0.9093,75.38379 0.015,113 0.1416,5.76617 2.6476,11.30206 2.6381,17 -0.017,10.48846 -9.1539,20.18549 -19.6527,19.94519 -21.3689,-0.48907 -17.0053,-22.16711 -17,-35.94519 V 125.41872 l -36,2 m 56,349.31561 c 26.4602,-3.21899 29.1794,40.66425 3,43.34412 -27.0084,2.76471 -29.2496,-40.15076 -3,-43.34412 m 99,35.01001 c 50.2337,-8.38849 64.0431,67.38983 14.0038,75.57947 -48.1544,7.88116 -62.9019,-67.414 -14.0038,-75.57947 m -321.00001,41.06482 c 24.65292,-5.37066 35.37012,33.15302 11,39.07636 -25.85693,6.28479 -36.81372,-33.45288 -11,-39.07636 z"
                id="path1" />
              </g>
            </svg>}
        </div>
        <div className="message">
          {message.message}
        </div>
      </div>
    </div>
  )
}

export default ChatPage;