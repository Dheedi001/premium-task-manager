// This is a reusable Component
function Topic(props) {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h3>Topic: {props.name}</h3>
      <p>Status: {props.status}</p>
    </div>
  );
}

export default Topic;