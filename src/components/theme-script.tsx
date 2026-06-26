export function ThemeScript() {
  // Set theme before paint to avoid flash. Defaults to dark.
  const code = `
(function(){try{
  var t=localStorage.getItem('gp-theme')||'dark';
  if(t==='dark')document.documentElement.classList.add('dark');
}catch(e){document.documentElement.classList.add('dark');}})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
