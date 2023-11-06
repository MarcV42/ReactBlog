import { useNavigate } from "react-router-dom";
import EntryComponent from "../../components/EntryComponent.tsx";
import SortingComponent from "../../components/SortingComponent.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { BlogEntry } from "../../model/BlogEntryModel.tsx";
import AppHeader from "../../components/AppHeader.tsx";
import styled from "styled-components";
import AddIcon from "../../assets/plus-circle.svg";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import "./HomePage.css"; // Import the CSS file for styling

// Main container for the HomePage
const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0.4em;
  gap: 0.59em;
`;

// Button for creating a new blog entry
const NewEntryButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.3em;
  font-size: 2.3em;
  font-weight: 680;
  background-color: #3a608c;
  cursor: pointer;
  transition: border-color 4.25s;
  position: relative;
`;

// Icon for the "New Entry" button
const AddButtonIcon = styled.img`
  color: #3e608c;
  width: 1.4em;
  position: absolute;
  top: 0.4em;
  left: 2.4em;
  font-size: 30px;
`;

// Container for displaying a list of blog entries
const BlogList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 1em;
  font-size: 1.1em;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.25em;
  font-weight: 340;
  background-color: rgb(166, 115, 96);
  cursor: text;
  transition: border-color 0.25s;
  position: relative;
`;

// Small new entry button
const NewEntryButtonSmall = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.2em;
  font-size: 1.3em;
  font-weight: 200;
  background-color: #A67360FF;
  cursor: pointer;
  transition: border-color 0.95s;
  position: relative;
`;

// Small new entry button for Excel export
const NewEntryButtonSmallExc = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.1em;
  font-size: 1.0em;
  font-weight: 200;
  color: #242424;
  background-color: #dbba60;
  cursor: pointer;
  transition: border-color 0.95s;
  position: relative;
`;

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
            <Main>
                <p>This is the place to express and document your daily happenings</p>
                <NewEntryButtonSmall type="button" onClick={login}>Log in</NewEntryButtonSmall>
                <NewEntryButtonSmall onClick={whoAmI}>Show my User ID</NewEntryButtonSmall>
                {isLoggedIn && <p>You are logged in successfully! {userId} (User ID)</p>}
                {isLoggedIn && (
                    <NewEntryButtonSmall type="button" onClick={handleLogout}>
                        Logout
                    </NewEntryButtonSmall>
                )}
                <NewEntryButton type="button" onClick={() => navigateTo('/newentry')}>
                    <AddButtonIcon src={AddIcon} alt="Add Icon" />New Entry
                </NewEntryButton>
                <NewEntryButtonSmallExc onClick={ExcelExport}>Export Excel-File</NewEntryButtonSmallExc>
                <SortingComponent entries={entries} setEntries={setEntries} />
                <BlogList>
                    {entries.slice().reverse().map((entry) => {
                        return <EntryComponent key={entry.id} blogEntry={entry} />;
                    })}
                </BlogList>
            </Main>
        </>
    );
}
