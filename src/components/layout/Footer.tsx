export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Digital Library BF
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Bibliothèque Numérique du Burkina Faso. <br className="hidden md:inline" />
              Découvrez et téléchargez des livres et documents gratuitement.
            </p>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Digital Library BF. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
