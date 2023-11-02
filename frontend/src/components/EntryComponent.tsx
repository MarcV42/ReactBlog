import { BlogEntry } from "../model/BlogEntryModel.tsx";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BookmarkSvg from "../assets/bookmark.svg";


export type props = {
    blogEntry: BlogEntry;
};

const Container = styled.li`
  border: 0.4em #733f34 solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 2em;
  position: relative;
  gap: 0.4em;

  @media (max-width: 768px) {
    padding: 1em; // Reduziere den Abstand in der mobilen Ansicht
  }
`;

const Title = styled.h2`
  font-size: 1.8em;
  align-self: center;
  color: #f2f2f2;

  @media (max-width: 768px) {
    font-size: 1.4em; // Kleinere Schriftgröße in der mobilen Ansicht
  }
`;

const EntryDate = styled.small`
  align-self: flex-start;
  position: absolute;
  bottom: 1.2em;
  right: 0.6em;
  font-size: 0.8em;
  color: #90d2d8;

  @media (max-width: 768px) {
    font-size: 0.7em; // Kleinere Schriftgröße in der mobilen Ansicht
  }
`;

const BookmarkButton = styled.button`
  width: 3em;
  border-radius: 10px;
  position: absolute;
  top: -1.2em;
  right: 0.2em;
  align-self: end;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    top: 0.2em; // Position oben in der mobilen Ansicht
    right: 0.2em;
  }
`;

const Button = styled.button`
  border-radius: 10px;
  position: relative;
  align-self: end;
  padding: 0;
  background-color: rgb(44, 59, 89);
  border: none;
  cursor: pointer;
  width: 100%;
  height: 3em;
  font-size: 1em;

  @media (max-width: 768px) {
    font-size: 0.9em; // Kleinere Schriftgröße in der mobilen Ansicht
  }
`;

const TagList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 0.4em;
  list-style: none;

  @media (max-width: 768px) {
    gap: 0.2em; // Kleinere Lücke zwischen Tags in der mobilen Ansicht
  }
`;

const Tag = styled.li`
  padding: 0.2em;
  font-size: 0.9em;

  @media (max-width: 768px) {
    font-size: 0.7em; // Kleinere Schriftgröße für Tags in der mobilen Ansicht
  }
`;

export default function EntryComponent(props: props) {
    const date: string = new Date(props.blogEntry.timeCreated).toLocaleDateString();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    const time: string = new Date(props.blogEntry.timeCreated).toLocaleTimeString(undefined, timeOptions);
    const navigateTo = useNavigate();

    function handleClickBookmark() {
        console.log("Bookmark was clicked.");
    }

    function handleClickMore() {
        navigateTo("/details/" + props.blogEntry.id);
    }

    function truncateString(str: string, maxLength: number) {
        if (str.length <= maxLength) {
            return str;
        } else {
            return str.slice(0, maxLength) + "...";
        }
    }

    const mainTextfieldText = props.blogEntry.content;
    const truncatedString = truncateString(mainTextfieldText, 122);


    return (
        <Container>
            <Title>{props.blogEntry.title}</Title>
            <p>Author: {props.blogEntry.author}</p>
            <EntryDate>{date + " " + time}</EntryDate>
            <BookmarkButton type="button" onClick={handleClickBookmark}>
                <img src={BookmarkSvg} alt="Bookmark" />
            </BookmarkButton>
            <p>{truncatedString}</p>
            <Button type="button" onClick={handleClickMore}>
                Show more
            </Button>
            <TagList>
                {props.blogEntry.hashtags.map((hashtag) => {
                    return <Tag>{hashtag}</Tag>;
                })}
            </TagList>
        </Container>
    );
}