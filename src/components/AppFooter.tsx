const AppFooter = () => {
  return (
    <footer className="mb-4 md:mb-8 px-6 text-center">
      <div className="max-w-md mx-auto">
        <p className="mt-0 font-body text-xs text-muted-foreground/60 tracking-wide">
          Σας αρέσει αυτή η σελίδα; Θέλετε και εσείς μια παρόμοια;{" "}
          <p>Επικοινωνήστε μαζί μας και πείτε μας τις ανάγκες σας!{" "}</p>
          <a href="https://oikonomou-portfolio.web.app/" target="_blank" className="text-primary hover:underline">
            https://oikonomou-portfolio.web.app
          </a> 
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
