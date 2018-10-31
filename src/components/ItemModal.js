// Node Modules
import moment from 'moment';
// Components
import Comment from './Comment';
// Modules
import { store, renderList } from '../index';
import { fadeOut, getListKey, findAndReplaceLinks } from '../utils';
import { startAddComment } from '../redux/actions/lists';

const ItemModal = (props) => {
    const { item } = props;

    const modal = document.createElement('div');
    modal.className = 'modal-mask';
    modal.addEventListener('click', e => e.target.className === 'modal-mask' && fadeOut(modal, 200));

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content--details';
    modalContent.style.borderTop = `20px solid ${item.color}`

    const infoEl = document.createElement('div');
    infoEl.className = 'modal-content__info';
    
    const titleEl = document.createElement('h1');
    titleEl.className = 'modal-content__title';
    titleEl.innerHTML = findAndReplaceLinks(item.title);
    infoEl.appendChild(titleEl);

    const dateEl = document.createElement('div');
    dateEl.className = 'modal-content__date';
    dateEl.innerHTML = moment(item.date).format('MM/DD/YYYY');
    infoEl.appendChild(dateEl);

    const commentsContainerEl = document.createElement('div');
    commentsContainerEl.className = 'comments-container';

    
    const commentsContainerHeaderEl = document.createElement('div');
    commentsContainerHeaderEl.className = 'comments-container__header';
    commentsContainerHeaderEl.innerHTML = '<div>Comments</div>'

    const addCommentEl = document.createElement('i');
    addCommentEl.className = 'fas fa-plus';
    addCommentEl.style.cursor = 'pointer';
    addCommentEl.addEventListener('click', () => handleAddCommentClick(props));
    commentsContainerHeaderEl.appendChild(addCommentEl);
    commentsContainerEl.appendChild(commentsContainerHeaderEl);
    // Render existing comments
    item.comments.forEach(comment => commentsContainerEl.appendChild(Comment({ ...comment, color: item.color })));
    const blankStateEl = document.createElement('div');
    blankStateEl.className = 'comment-blank-state';
    blankStateEl.innerHTML = "You haven't made any comments yet"
    item.comments.length === 0 && commentsContainerEl.appendChild(blankStateEl);

    modal.appendChild(modalContent);
    modalContent.append(infoEl);
    modalContent.append(commentsContainerEl);

    return modal;
};

function handleAddCommentClick({ item: { id, color }, parentListId }) {
    const formExists = !!document.querySelector('#comment-form');
    if (!formExists) {
        // Append a form and focus it
        const commentForm = document.createElement('form');
        commentForm.id = 'comment-form';        
        const textArea = document.createElement('textarea');
        textArea.style.borderColor = color;
        const submitButton = document.createElement('button');
        submitButton.style.backgroundColor = color;
        submitButton.innerHTML = 'Submit';
        commentForm.appendChild(textArea);
        commentForm.appendChild(submitButton);
        document.querySelector('.comments-container').appendChild(commentForm);
        textArea.focus();
        textArea.scrollIntoView();
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const comment = {
                text: textArea.value,
                date: moment().valueOf()
            };
            store.dispatch(startAddComment(getListKey(parentListId), id, comment));
            // Add to currently open modal and renderList to save changes
            document.querySelector('.comments-container').appendChild(Comment({ ...comment, color }));
            renderList(parentListId);
            e.target.remove();
            // Remove blank state if it exists
            const blankStateEl = document.querySelector('.comment-blank-state');
            blankStateEl && blankStateEl.remove();
        });
    }
}

export default ItemModal;