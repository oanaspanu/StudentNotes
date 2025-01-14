import React from 'react'
import {FaNoteSticky} from 'react-icons/fa6'
import notes from '../assets/data'
import ListItem from '../components/ListItem'

const NoteListPage = () => {
  return (
    <div className='notes'>
        <div className='notes-header'>
            <h2 className='notes-title'>
                <FaNoteSticky /> Student Notes
            </h2>
            <p className='notes-count'>{notes.length}</p>
        </div>
        <div className='notes-list'>
            {
                notes.map(note => (
                    <ListItem key={note.id} note={note}/>
                ))
            }
        </div>
    </div>
  )
}

export default NoteListPage
