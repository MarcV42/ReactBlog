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
    padding: 1em;
  }
`;

const Title = styled.h2`
  font-size: 1.8em;
  align-self: center;
  color: #f2f2f2;

  @media (max-width: 768px) {
    font-size: 1.4em;
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
    font-size: 0.7em;
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
    top: 0.2em;
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
    font-size: 0.9em;
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
    gap: 0.2em;
  }
`;

const Tag = styled.li`
  padding: 0.2em;
  font-size: 0.9em;

  @media (max-width: 768px) {
    font-size: 0.7em;
  }
`;

const TruncatedText = styled.p`
  word-break: normal;
  white-space: pre-line;
  @media (max-width: 768px) {
    font-size: 0.9em;
  }
`;

export default function EntryComponent(props: props) {
    const date: string = new Date(props.blogEntry.timeCreated).toLocaleDateString();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    const time: string = new Date(props.blogEntry.timeCreated).toLocaleTimeString(undefined, timeOptions);
    const navigateTo = useNavigate();

    function handleClickBookmark() {
        window.alert("Bookmark was clicked.");
    }

    function handleClickMore() {
        navigateTo("/details/" + props.blogEntry.id);
    }

    function truncateTextByLineCount(text: string, lineCount: number) {
        const lines = text.split("\n");
        if (lines.length > lineCount) {
            return lines.slice(0, lineCount).join("\n") + "...";
        }
        return text;
    }

    const mainTextfieldText = props.blogEntry.content;
    const truncatedText = truncateTextByLineCount(mainTextfieldText, 2500);

    return (
        <Container>
            <Title>{props.blogEntry.title}</Title>
            <p>Author: {props.blogEntry.author}</p>
            <EntryDate>{date + " " + time}</EntryDate>
            <BookmarkButton type="button" onClick={handleClickBookmark}>
                <img src={BookmarkSvg} alt="Bookmark" />
            </BookmarkButton>
            <TruncatedText>{truncatedText}</TruncatedText>
            <Button type="button" onClick={handleClickMore}>
                Show more
            </Button>
            <TagList>
                {props.blogEntry.hashtags.map((hashtag, index) => (
                    <Tag key={index}>{hashtag}</Tag>
                ))}
            </TagList>
        </Container>
    );
}
