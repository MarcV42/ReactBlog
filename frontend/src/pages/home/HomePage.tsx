import { useNavigate } from "react-router-dom";
import EntryComponent from "../../components/EntryComponent.tsx";
import SortingComponent from "../../components/SortingComponent.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { BlogEntry } from "../../model/BlogEntryModel.tsx";
import AppHeader from "../../components/AppHeader.tsx";
import AddIcon from "../../assets/plus-circle.svg";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import "./HomePage.css"; // Import the CSS file for styling

export default function HomePage() {
    const [entries, setEntries] = useState<BlogEntry[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userId, setUserId] = useState("");
    const navigateTo = useNavigate();

    // Function to fetch blog entries
    const fetchEntries = () => {
        axios
            .get('/api/blogs')
            .then((response) => {
                setEntries(response.data);
            })
            .catch((error) => {
                // Display an error popup
                window.alert('Error found: ' + error.message);
            });
    };

    // Load blog entries on component mount
    useEffect(() => {
        fetchEntries();
    }, []);

    // Function for initiating login
    const login = () => {
        const host =
            window.location.host === 'localhost:5173'
                ? 'http://localhost:8080'
                : window.location.origin;

        // Assuming this is where you handle the login process
        window.open(host + '/oauth2/authorization/github');

        // Once the login is successful, call handleLoginSuccess
        handleLoginSuccess();
    };

    // Function to retrieve the user's ID
    const whoAmI = () => {
        axios
            .get('/api/user/me')
            .then((response) => {
                setUserId(response.data); // Set user ID in the state
            })
            .catch((error) => {
                // Display an error popup
                window.alert('Error found: ' + error.message);
            });
    };

    // Function for handling successful login
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    // Function for user logout
    const handleLogout = () => {
        const host =
            window.location.host === 'localhost:5173'
                ? 'http://localhost:8080'
                : window.location.origin;

        // Open the GitHub logout URL to end the OAuth session
        window.location.href = 'https://github.com/logout';
        document.cookie = 'sessionCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure';

        // Close the OAuth2 popup window (replace 'oauthPopup' with the actual window name)
        const oauthPopup = window.open(host + '/oauth2/authorization/github');
        if (oauthPopup) {
            oauthPopup.close();
        }
        setIsLoggedIn(false);

        navigateTo('/');
    };

    // Function to export data to an Excel file
    const ExcelExport = () => {
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // Add headers to the Excel worksheet
        worksheet.addRow(['ID', 'Author', 'Title', 'Content', 'Hashtags', 'Entry Time']);

        // Insert data from the database into Excel
        entries.forEach((entry) => {
            worksheet.addRow([entry.id, entry.author, entry.title, entry.content, entry.hashtags, entry.timeCreated]);
        });

        // Save the Excel file as a Blob
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Download the Excel file
            saveAs(blob, 'export.xlsx');
        });
    };

    return (
        <>
            <AppHeader headerText="MyBlog App" />
            <div className="main">
                <p>This is the place to express and document your daily happenings</p>
                <button className="Login-button" type="button" onClick={login}>
                    Log in
                </button>
                <button className="ShowUser-button" onClick={whoAmI}>
                    Show my User ID
                </button>
                {isLoggedIn && <p>You are logged in successfully! {userId} (User ID)</p>}
                {isLoggedIn && (
                    <button className="Logout-button" type="button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
                <button className="new-entry-button" type="button" onClick={() => navigateTo('/newentry')}>
                    <img className="add-button-icon" src={AddIcon} alt="Add Icon" />
                    New Entry
                </button>
                <button className="Excell-button" onClick={ExcelExport}>
                    Export Excel-File
                </button>
                <SortingComponent entries={entries} setEntries={setEntries} />
                <ul className="blog-list">
                    {entries.slice().reverse().map((entry) => {
                        return <EntryComponent key={entry.id} blogEntry={entry} />;
                    })}
                </ul>
            </div>
        </>
    );
}
