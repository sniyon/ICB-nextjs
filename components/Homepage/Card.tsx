import '../../styles/Components/Card.css';

export default function Card({ title, description, image, date} : { title: string, description: string, image: string, date?: string }) {
    return (
        <div className="card-container">
        <img src={image} alt={title} className="card-image" />
        <div className="card-content">
            <h3 className="card-title">{title}</h3>
            <p className='card-date'>{date}</p>
            <p className="card-description">{description}</p>
        </div>
        </div>
    );
    }