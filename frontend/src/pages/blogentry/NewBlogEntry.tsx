import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NewBlog, Tag } from "./model/model.ts";
import styled from "styled-components";
import AppHeader from "../../components/AppHeader.tsx";
import AddSvg from "../../assets/plus-circle.svg";
import MinusSvg from "../../assets/minus-circle.svg";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.6em;
  gap: 0.6em;
`;

const TitleInput = styled.input`
  font-size: 1.9em;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.4em;
  font-weight: 500;
  background-color: rgb(166, 115, 96);
  cursor: text;
  transition: border-color 0.25s;
  position: relative;
`;

const ContentTextarea = styled.textarea`
  font-size: 1.2em;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.4em;
  font-weight: 500;
  background-color: rgb(157, 133, 118);
  cursor: text;
  transition: border-color 0.25s;
  position: relative;
`;

const TagsTitle = styled.span`
  font-size: 0.9em;
  background-color: rgba(45, 51, 50, 0.71);
  padding: 0.4em;
  border-radius: 8px;
  border: 1px solid transparent;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  font-size: 1.2em;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.4em;
  font-weight: 500;
  background-color: rgba(45, 51, 50, 0.71);
  cursor: text;
  transition: border-color 0.25s;
  position: relative;
`;

const SingleTag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  gap: 0.4em;
`;

const TagLabel = styled.label`
  font-size: 1.2em;
  width: 2em;
  text-align: end;
  align-self: center;
`;

const TagInput = styled.input`
  width: 70%;
  font-size: 1.2em;
`;

const TagButton = styled.button`
  width: 3em;
  height: 3em;
  font-size: 1em;
  position: relative;
  background: none;
  border: none;
`;

const ButtonImage = styled.img`
  width: 2.4em;
  position: absolute;
  top: 0.2em;
  left: 0;
`;

const SubmitButton = styled.button`
  border-radius: 8px;
  padding: 0.8em;
  font-size: 2em;
  background-color: #3E608C;
  border: none;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
`;

export default function NewBlogEntry() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tags, setTags] = useState<Tag[]>([{ name: "" }]);
    const navigateTo = useNavigate();

    const changeTagName = (index: number, name: string) => {
        const newTags = [...tags];
        newTags[index].name = name;
        setTags(newTags);
    };

    function handleOnSubmit() {
        const filteredTags = tags.filter((tag) => tag.name !== "");
        const mytags = filteredTags.map((item) => item.name);

        const newBlogEntry: NewBlog = {
            title: title,
            content: text,
            hashtags: mytags,
        };

        axios
            .post("/api/blogs", newBlogEntry)
            .then(() => navigateTo("/"))
            .catch((error) => {
                // Display a pop-up for the error
                alert("Error while saving: " + error.message);
            });
    }

    const removeTag = (index: number) => {
        if (tags.length > 1) {
            const newTags = [...tags];
            newTags.splice(index, 1);
            setTags(newTags);
        }
    };

    const insertTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index + 1, 0, { name: "" });
        setTags(newTags);
    };

    return (
        <>
            <AppHeader headerText="New Blog" />
            <Main>
                <TitleInput
                    type="text"
                    placeholder="What's on my mind right now"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
                <ContentTextarea
                    rows={15}
                    placeholder="Enter your Text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                />
                <TagsTitle>Enter Hashtags:</TagsTitle>
                <TagContainer>
                    {tags &&
                        tags.map((tag, index) => (
                            <SingleTag key={index}>
                                <TagLabel htmlFor={"tag" + (index + 1)}>{index + 1}. </TagLabel>
                                <TagInput
                                    id={"tag" + (index + 1)}
                                    value={tag.name}
                                    placeholder="#HashTag"
                                    onChange={(event) => changeTagName(index, event.target.value)}
                                />
                                <TagButton type="button" onClick={() => removeTag(index)}>
                                    <ButtonImage src={MinusSvg} alt="Minus Icon" />
                                </TagButton>
                                <TagButton type="button" onClick={() => insertTag(index)}>
                                    <ButtonImage src={AddSvg} alt="Plus Icon" />
                                </TagButton>
                            </SingleTag>
                        ))}
                </TagContainer>
                <SubmitButton onClick={handleOnSubmit}>Submit</SubmitButton>
            </Main>
        </>
    );
}
