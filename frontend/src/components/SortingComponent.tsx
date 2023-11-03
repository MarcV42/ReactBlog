import {BlogEntry} from "../model/BlogEntryModel.tsx";
import {ChangeEvent} from "react";
import styled from "styled-components";


type props =
    {
        entries: BlogEntry[],
        setEntries: (entries: BlogEntry[]) => void
    };

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-end;
  justify-content: end;
  gap: 0.4em;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: #733f34;
  padding: 0.4em;
  position: relative;
`;


const SortSelect = styled.select`
  font-size: 1.4em;

`;

const SortOption = styled.option`
  font-size: 0.6em;
`;

export default function SortingComponent(props: props) {

    function handleChangeSortBy(event: ChangeEvent<HTMLSelectElement>) {
        const sortBy = event.target.value;
        const sortedEntries = [...props.entries];
        if (sortBy === 'oldest to newest') {
            sortedEntries.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
        } else if (sortBy === 'newest to oldest') {
            sortedEntries.sort((a, b) => new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime());
        }
        props.setEntries(sortedEntries);
    }

    return <Container>
        <SortSelect id="sort-by" onChange={handleChangeSortBy}>
            <SortOption value="newest to oldest">newest to oldest</SortOption>
            <SortOption value="oldest to newest">oldest to newest</SortOption>
        </SortSelect>
    </Container>
}