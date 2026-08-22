export default function Loading() {
  return (
    <main className="internal-main" aria-busy="true" aria-label="Loading content">
      <section className="internal-hero state-page">
        <div className="container state-card loading-card">
          <span className="state-kicker">ABRIT · LOADING</span>
          <div className="loading-line wide" />
          <div className="loading-line" />
          <div className="loading-line short" />
        </div>
      </section>
    </main>
  );
}
