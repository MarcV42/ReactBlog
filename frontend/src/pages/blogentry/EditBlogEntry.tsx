import {BlogEntry} from "../../model/BlogEntryModel.tsx";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import React, {useEffect, useState} from "react";
import AppHeader from "../../components/AppHeader.tsx";
import styled from "styled-components";
import MinusSvg from "../../assets/minus-circle.svg";
import PlusSvg from "../../assets/plus-circle.svg";


const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.6em;
  gap: 0.6em;
`;

const TitleInput = styled.input`
  font-size: 1.4em;
`;

const ContentTextarea = styled.textarea`
  font-size: 1.2em;
`;

const TagsTitle = styled.span`
  font-size: 1.2em;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4em;
`;

const SingleTag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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

const ButtonContainer = styled.div`
    display: flex;
  gap: 0.6em;
  justify-content: stretch;
`;

const Button = styled.button`
  border-radius: 10px;
  padding: 0.6em;
  background-color: #90d2d8;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 1.2em;
`;

export default function EditBlogentry(){
    const navigateTo = useNavigate()
    const {id} = useParams();
    const [blogentry, setBlogentry] = useState<BlogEntry>()
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios(`/api/blogs/${id}`);
                setBlogentry(response.data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchBlog().then();
    }, [id]);


    const deleteTag = (index: number) => {
        if (blogentry && blogentry.hashtags) {
            const newTags = [...blogentry.hashtags];
            newTags.splice(index, 1);
            setBlogentry({...blogentry, hashtags: newTags});
        }
    };

    const insertTag = (index: number) => {
        if (blogentry && blogentry.hashtags) {
            const newTags = [...blogentry.hashtags];
            newTags.splice(index + 1, 0, ""); // Füge ein leeres Tag nach dem aktuellen Index hinzu
            setBlogentry({ ...blogentry, hashtags: newTags });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (blogentry) {
            const mytags = blogentry.hashtags.filter((tag) => tag !== "");

            console.log(blogentry)
            console.log(mytags)
            const date = blogentry.timeCreated ? new Date(blogentry.timeCreated) : new Date();
            const formattedDate = date.toISOString()

            const changedBlogEntry: BlogEntry =
                {
                    id: blogentry.id,
                    title: blogentry.title,
                    content: blogentry.content,
                    hashtags: mytags,
                    timeCreated: formattedDate,
                    author: blogentry.author,
                };
            axios
                .put("/api/blogs/" + id, changedBlogEntry)
                .then(() => navigateTo("/"))
                .catch((error) => {
                    console.error("Fehler beim Speichern:", error);
                });
        }
    }


    if (loading) return <div>Loading...</div>
    if (error) return <div>Something went wrong</div>

    return (
        <>
            <AppHeader headerText={"Edit Blog"} />
            <EditForm onSubmit={handleSubmit}>
                {blogentry && (
                    <>
                        <TitleInput
                            type="text"
                            value={blogentry.title || ""}
                            onChange={(e) => {
                                setBlogentry({ ...blogentry, title: e.target.value });
                            }}
                        />
                        <ContentTextarea
                            rows={23}
                            value={blogentry.content}
                            onChange={(e) => {
                                setBlogentry({ ...blogentry, content: e.target.value });
                            }}
                        />
                        <TagsTitle>Tags:</TagsTitle>
                        <TagContainer>
                            {blogentry.hashtags &&
                                blogentry.hashtags.map((tag, index) => (
                                    <SingleTag key={index}>
                                        <TagLabel htmlFor={"tag" + (index + 1)}>{index + 1}. </TagLabel>
                                        <TagInput
                                            maxLength={20}
                                            type="text"
                                            id={"tag" + (index + 1)}
                                            value={tag}
                                            onChange={(event) => {
                                                const newTags = [...blogentry.hashtags];
                                                newTags[index] = event.target.value;
                                                setBlogentry({ ...blogentry, hashtags: newTags });
                                            }}
                                        />
                                        <TagButton type={"button"} onClick={() => deleteTag(index)}>
                                            <ButtonImage src={MinusSvg} alt="Reduce Icon" />
                                        </TagButton>
                                        <TagButton type={"button"} onClick={() => insertTag(index)}> {/* Plus-Schaltfläche hinzugefügt */}
                                            <ButtonImage src={PlusSvg} alt="Add Icon" />
                                        </TagButton>
                                    </SingleTag>
                                ))}
                        </TagContainer>
                    </>
                )}
                <ButtonContainer>
                    <Button type="button" onClick={() => navigateTo("/")}>
                        Discard
                    </Button>
                    <Button type="submit" onClick={handleSubmit}>
                        Save
                    </Button>
                </ButtonContainer>
            </EditForm>
        </>
    );
}
