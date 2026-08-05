import { useEffect, useState } from 'react';

import { RouteWrapper, SessionExpiredModal, WarningDialog } from '@rssa-project/study-template';
import { BrowserRouter as Router } from 'react-router-dom';
import { componentMap } from './pages/componentMap';
import WelcomePage from './pages/WelcomePage';
import './styles/App.css';
import { STRINGS } from './utils/constants';

function App() {
    const [showWarning, setShowWarning] = useState<boolean>(false);

    /*
     * UseEffect to handle window resize events.
     * Trigger conditions:
     * 	- On component mount but sets a listener on window resize.
     */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200) {
                setShowWarning(true);
            } else if (window.innerWidth >= 1200) {
                setShowWarning(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="text-center text-base font-light">
            {showWarning && (
                <WarningDialog
                    show={showWarning}
                    onClose={setShowWarning}
                    title="Warning"
                    message={STRINGS.WINDOW_TOO_SMALL}
                    disableHide={true}
                />
            )}
            <SessionExpiredModal />
            <Router>
                <RouteWrapper componentMap={componentMap} WelcomePage={WelcomePage} />
            </Router>
        </div>
    );
}

export default App;
