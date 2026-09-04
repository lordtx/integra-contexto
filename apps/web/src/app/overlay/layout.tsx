export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-transparent min-h-screen">
        {children}
      </body>
    </html>
  );
}