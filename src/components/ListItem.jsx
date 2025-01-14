import React from 'react'
import { Link } from 'react-router-dom';

const getDate = note =>{
    return new Date(note.updated).toLocaleDateString('ro-RO')
}

const getTitle = note =>{
    return note.body.split("\n")[0];
}

const getContent = note =>{
    const title = getTitle(note)
    return note.body.replaceAll("\n", " ").replace(title, '')
}

const ListItem = ({note}) => {
    return (
        <Link to={`/note/${note.id}`}>
            <div className='notes-list-item'>
                <h3>{getTitle(note)}</h3>
                <p>
                    <span>{getDate(note)}</span>
                    {getContent(note)}
                </p>
            </div>
        </Link>
    )
}

export default ListItem
