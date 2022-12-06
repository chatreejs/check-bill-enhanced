import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface Language {
  code: string;
  countryCode: string;
  name: string;
}

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent implements OnInit {
  languages: Language[] = [
    {
      code: 'en-US',
      countryCode: 'us',
      name: 'English (US)',
    },
    {
      code: 'th-TH',
      countryCode: 'th',
      name: 'ภาษาไทย',
    },
    {
      code: 'zh-CN',
      countryCode: 'cn',
      name: '简体中文',
    },
    {
      code: 'ja-JP',
      countryCode: 'jp',
      name: '日本語',
    },
    {
      code: 'ko-KR',
      countryCode: 'kr',
      name: '한국어',
    },
    {
      code: 'de-DE',
      countryCode: 'de',
      name: 'Deutsch',
    },
    {
      code: 'ru-RU',
      countryCode: 'ru',
      name: 'Русский',
    },
  ];
  selectedLanguage!: Language;

  constructor(private translate: TranslateService) {}

  get languageStorage(): string {
    return localStorage.getItem('language') || '';
  }

  ngOnInit(): void {
    const languages = this.languages.map((language) => language.code);
    this.translate.addLangs(languages);
    this.translate.setDefaultLang('en-US');
    this.initDefaultLanguage();
  }

  initDefaultLanguage() {
    let language;
    if (this.languageStorage) {
      language = this.languages.find(
        (language) => language.code === this.languageStorage,
      );
    } else {
      const browserLang = this.translate.getBrowserCultureLang();
      language = this.languages.find(
        (language) => language.code === browserLang,
      );
    }

    this.translate.use(language?.code || 'en-US');
    this.selectedLanguage = language || this.languages[0];
    this.saveLanguageToStorage(this.selectedLanguage);
  }

  changeLanguage(language: Language) {
    this.selectedLanguage = language;
    this.translate.use(language.code);
    this.saveLanguageToStorage(language);
  }

  saveLanguageToStorage(language: Language) {
    localStorage.setItem('language', language.code);
  }
}
