import { useRouter } from 'next/router';
import styles from './LanguageSwitcher.module.css';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
];

export default function LanguageSwitcher() {
  const router = useRouter();

  const changeLanguage = (locale: string) => {
    void router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      router.asPath,
      { locale }
    );
  };

  return (
    <label className={styles.switcher}>
      <span className={styles.label}>Language</span>
      <select
        aria-label="Language"
        className={styles.select}
        value={router.locale ?? 'en'}
        onChange={(event) => changeLanguage(event.target.value)}
      >
        {LOCALES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
