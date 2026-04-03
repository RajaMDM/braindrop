export default function Footer() {
  return (
    <footer style={{
      padding: '12px 20px', textAlign: 'center',
      fontSize: '.65rem', color: 'var(--t3)',
      borderTop: '1px solid var(--bd)',
      background: 'rgba(11,11,20,.6)', flexShrink: 0, lineHeight: 1.6,
    }}>
      <div style={{ color: 'var(--nk)', fontStyle: 'italic', fontSize: '.68rem' }}>
        "Built by a father who believes his daughters can conquer anything — and so can you." — For Alishba &amp; Inaayah &#x2726;
      </div>
      &copy; 2026{' '}
      <a href="mailto:raja.cloudmdm@gmail.com" style={{ color: 'var(--np)', textDecoration: 'none' }}>Raja Shahnawaz Soni</a>
      {' '}&middot;{' '}
      <a href="mailto:raja.cloudmdm@gmail.com" style={{ color: 'var(--np)', textDecoration: 'none' }}>raja.cloudmdm@gmail.com</a>
      {' '}&middot;{' '}
      <a href="https://www.linkedin.com/in/raja-shahnawaz/" target="_blank" rel="noreferrer" style={{ color: 'var(--np)', textDecoration: 'none' }}>LinkedIn</a>
      {' '}&middot;{' '}
      <a href="https://github.com/RajaMDM" target="_blank" rel="noreferrer" style={{ color: 'var(--np)', textDecoration: 'none' }}>GitHub</a>
      {' '}&middot; BrainDrop — Multiple AI Engines
    </footer>
  );
}
