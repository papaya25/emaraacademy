import Link from "next/link";
import Rosette from "@/components/Rosette";

export default function NotFound() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الصفحة المفقودة</p>
          <Rosette />
          <h1>This Page Wandered Off</h1>
          <p>
            The page you&rsquo;re looking for doesn&rsquo;t exist — but the rest
            of the book is right here.
          </p>
          <div className="title-actions" style={{ marginTop: "1.6em" }}>
            <Link className="btn btn-green" href="/">
              Back to the Title Page
            </Link>
            <Link className="btn btn-ghost" href="/programs">
              See the Programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
