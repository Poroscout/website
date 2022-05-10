import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import '../../assets/css/fourOhFour.css';
import Header from '../home/Header';

export default function FourOhFour() {
  return (
    <div className="hero w-screen h-screen overflow-hidden">
      <div className="hero-grid w-screen h-screen overflow-hidden">
        <div className="hero-overlay w-screen h-screen overflow-hidden">
          <Header />

          <div className="flex h-screen">
            <div className="m-auto space-y-2 text-center">
              <h1 className="text-3xl md:text-5xl text-white font-bold leading-tight text-shadow-sm mb-5">
                <span className="text-league">404</span> Page Not Found
              </h1>

              {/* <p className="text-gray-200 text-lg">Looks like your lost!.</p> */}

              <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap mt-5" to="/">
                <FontAwesomeIcon icon={["fas", "home"]} />
                <span className="ml-2">Recall Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}