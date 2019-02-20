/*!
 * 
 * Copyright (c) 2015 Friedhelm Koch
 *
 * This file is part of viaLinked Project. It is subject to the license terms 
 * in the LICENSE file found in the top-level directory of this distribution 
 * and at http://www.viaLinked.com/license.html. 
 * No part of viaLinked Project, including this file, may be copied, modified, 
 * propagated, or distributed except according to the terms contained in the 
 * LICENSE file.
 *
 */


// Einstellungen für Initialisierung des Cordova Plugins EmailComposerWithAttachments
//
// Wait for Cordova to load
function onLoad() { document.addEventListener("deviceready", onDeviceReady, false); } 
// PhoneGap is ready
function onDeviceReady() { } // empty

// Header für iPhone/iPad iOS7 verbreitern
function iOSversion() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
	} else {
		return false;
	}
}
ver = iOSversion();

if (ver[0] >= 7) {
//	$(window).load(function(){
//		$('div[data-role="header"]').css('padding-top','20px');
//		$('.iOS7Header').css('margin-top','18px');
//	});
}	

////////////////////////////////////////////////////////////////////////////////
// Alle "document ready" Funktionen
////////////////////////////////////////////////////////////////////////////////
      
$(document).ready(function() {	

	/**
	 * jQuery Translate plugin ausführen
	 * 
	 */ 
//	$.translateInit('./lang/', 'viaJournal'); 				// Initialisierung von Verzeichnis und Dateinamen
//	$.translateLoad($.translateGetLanguage());				// Language Datenfile mit Übersetzungen laden
//	$.translateUpdateElements();										// IDs in die jeweilige Sprache übersetzen


	// Event wird beim Anzeigen der Seite ausgelöst
//	$( "#indexPage" ).on( "pageshow", function( event, ui ) {
//	});
 
	// Event wird beim Verlassen der Seite ausgelöst
//	$( "#indexPage" ).on( "pagehide", function( event, ui ) {
//	});
 
	// Event wird beim erstmaligen Laden ausgelöst 
//	$( document ).on( "pageinit", "#indexPage", function() {
//	});	
	
	// _________ Mobiscroll Spinning Wheels
	//				
	
	$(function(){
	
 		// Währung mit 7 Wheels - bis '9.999.999'
		var CurrencyWheels = [ // Wheel Group
		
			[	// 1. Wheel Group
				{ // Million Objekt
					label: 'M',
					values: [0, 1, 2, 3, 4 , 5, 6, 7, 8, 9], 
				}
			],
			
			[	// 2. Wheel group
				{ // Hunderttausend Objekt
					label: 'HT',
					values: [0, 1, 2, 3, 4 , 5, 6, 7, 8, 9],
				},
				{	// Zehntausend Objekt
					label: 'ZT',
					values: [0, 1, 2, 3, 4 , 5, 6, 7, 8, 9],
				},
				{	// Tausend Objekt
					label: 'T',
					values: [0, 1, 2, 3, 4 , 5, 6, 7, 8, 9],
				}
			],
			
			[ // 3. Wheel Group
				{	// Hundert Objekt
					label: 'H',
					values: [0, 1, 2, 3, 4 , 5, 6, 7, 8, 9],
				},
				{	// Zehner Objekt
					label: 'Z',
					values: [0, 1, 2, 3, 4 , 5, 6, 7, 8, 9],
				},
				{	// Einer Objekt
					label:'E',
					values: [0, 1, 2, 3, 4 , 5, 6, 7, 8, 9],
				}
			]
		]
				
		$('.currencyWheel').mobiscroll({
			theme: 'jqm', 
			display: 'bubble', 
			animate: 'fade', 
			wheels: CurrencyWheels, 
			mode: 'scroller',
			lang: 'de',										// deutsches i18n.de Format anziehen
			formatResult: function(data) {
				return trimNumber(data[0] + data[1] + data[2] + data[3] + data[4] + data[5] + data[6] + '');     
			},
			onShow: function(html, valueText, inst) {
				var count = 7,																													// Anzahl der dargestellten Räder !! MUSS angepasst werden!				
					wheel = [],																													// Array
					zeros = '0000000000',																									// String mit Nullen zum Auffüllen
					str = $(this).val().replace(/[.,]/g, '');															// Komma und/oder Punkte aus Input Feld entfernen
				zeros.slice(0, (count - str.length));																	// Anzahl Nullen extrahieren
				var strNeu = zeros.slice(0, (count - str.length)) + str;								// Nullen dem String vorne anhängen
				for(var i=0;i<strNeu.length;i++) { wheel.push(strNeu.substr(i, 1)); }		// Zahl in Array transportieren
				$(this).mobiscroll('setValue', wheel);																		// das aufgefüllte Array dem Scroller übergeben
			}
		});
	});			
		
	$(function(){
		var now = new Date();
		$('.wheelDatum').mobiscroll({
			preset: 'date',								// Datums Scroller
			dateFormat: 'yy-mm-dd',					// ISO-Datums-Format
			dateOrder: 'yymmdd',						// Tag und Monat 2-stellig
			fixedWidth: ['80','45','45'],
			rows: '5',											// 5 Reihen
			height: '35',
			lang: 'de',										// deutsches i18n.de Format anziehen
			theme: 'jqm',									// jquery Mobile Theme
			display: 'bubble',							// als Fenster darstellen
			animate: 'fade',
			mode: 'scroller',
			onShow: function(html, valueText, inst) {
				wheel = $(this).val();					// Datum aus Input auslesen
				$(this).mobiscroll('setValue', wheel);		// Datum des Inputs dem Scroller übergeben
			}
		});   
	});		 		

	
}); // Ende Document.Ready


////////////////////////////////////////////////////////////////////////////////
// JavaScript - Funktionen
////////////////////////////////////////////////////////////////////////////////

function initDB() {	
		
	// Wenn Datenbank initialisiert wurde, dann öffnen
	if(localStorage.getItem('db_viaJournal_085')) {
		
		// Initialieren des bestehenden LocalStorage - viaJournalDB_085: "{"tables":{},"data":{}}"
		viaJournalDB_085 = new localStorageDB("viaJournal_085", localStorage);
		
	} else {
		
		// Neu anlegen mit Beispieldaten
		viaJournalDB_085 = new localStorageDB("viaJournal_085", localStorage);
				
		// Check if the database was just created. Useful for initial database setup
		if(viaJournalDB_085.isNew()) {
			
			// _______ Hier werden alle Sach- Gemeinschafts- und Personen-Konten geführt
			//
			viaJournalDB_085.createTable("Konten", ["code", "datum", "ktoIdent", "ktoName", "ktoBemerkung", "ktoCompany", "ktoAnrede", "ktoVorName", "ktoNachName", "ktoStrasse", "ktoPLZ", "ktoOrt", "ktoLand", "ktoTel", "ktoEmail", "ktoBankUser", "ktoBank", "ktoBIC", "ktoIBAN", "ktoCCInstitut", "ktoCCUser", "ktoCCNummer", "ktoCCCode", "ktoCCDatum", "ktoPicture"]);
			// 1. Person
			viaJournalDB_085.insert("Konten", {
				code: 'eaa45bc10048cd3bdbd3b69c20c20070',	// MD5-Code aus ktoIdent, ktoCompany, ktoVor-, ktoNachName und ktoPLZ: 'Personen,,Ulrich,Meier,89122'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Personen',										// Ident für Personenkonto
				ktoName: null,													// Sach- oder Gemeinschaftskonto
				ktoBemerkung: 'Ulrich ist Skipper',			// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: 'Herr',											// Welche Person hat etwas gebucht		
				ktoVorName: 'Ulrich',		 							
				ktoNachName: 'Meier',
				ktoStrasse: 'Leepromenade 15',						// Strasse
				ktoPLZ: '89122',												// PLZ
				ktoOrt: 'München',											// Ort
				ktoLand: 'Deutschland',									// Land
				ktoTel: '0172 98467456',									// Telefon
				ktoEmail: 'ulrich@online.dex',						// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: 'Commerzbank München',					// Bankname
				ktoBIC:	'GEOPIOUT',											// BIC
				ktoIBAN: 'DE785368978909876',						// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum
				ktoPicture: null												// Photo
			});
			// 2. Person		
			viaJournalDB_085.insert("Konten", {
				code: '96f36e2980b7dab934718ad84d20a3eb',	// MD5-Code aus Company, Vor-, Nachname und PLZ: 'Personen,,Peter,Findus,10567'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Personen',										// Ident für Personenkonto
				ktoName: null,													// Sach- oder Gemeinschaftskonto
				ktoBemerkung: 'Peter ist Schiffsjunge',		// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: 'Herr',											// Welche Person hat etwas gebucht		
				ktoVorName: 'Peter',		 							
				ktoNachName: 'Findus',
				ktoStrasse: 'Schiffbauergasse 1',				// Strasse
				ktoPLZ: '10567',												// PLZ
				ktoOrt: 'Berlin',												// Ort
				ktoLand: 'Deutschland',									// Land
				ktoTel: '0171 7896146',									// Telefon
				ktoEmail: 'peter@t-online.dex',					// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: 'Volksbank Berlin',							// Bankname
				ktoBIC:	'GEOPHJK',											// BIC
				ktoIBAN: 'DE12345678909876',							// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum				
				ktoPicture: null												// Photo
			});
			// 3. Person
			viaJournalDB_085.insert("Konten", {
				code: '36be6add86ee56b69f2a3d33625637da',	// MD5-Code aus Company, Vor-, Nachname und PLZ: 'Personen,,Malte,Schuster,43551'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Personen',										// Ident für Personenkonto
				ktoName: null,													// Nur für Sach- oder Gemeinschaftskonto
				ktoBemerkung: 'Malte ist Navigator',			// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: 'Herr',											// Welche Person hat etwas gebucht		
				ktoVorName: 'Malte',		 							
				ktoNachName: 'Schuster',
				ktoStrasse: 'Hedwig-Maler-Str. 12',				// Strasse
				ktoPLZ: '43551',												// PLZ
				ktoOrt: 'Essen',												// Ort
				ktoLand: 'Deutschland',									// Land
				ktoTel: '0201 7897543',									// Telefon
				ktoEmail: 'malte.schuster@gmx.dex',				// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: 'Bankhaus Giradet',							// Bankname
				ktoBIC:	'GEIUTGFDE',										// BIC
				ktoIBAN: 'DE98758908769876',							// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum				
				ktoPicture: null												// Photo
			});
			// 4. Person
			viaJournalDB_085.insert("Konten", {
				code: 'ca911fe43425ba4fb76719a8299ed6d0',	// MD5-Code aus Company, Vor-, Nachname und PLZ: 'Personen,,Dietmar,Peterson,40483'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Personen',										// Ident für Personenkonto
				ktoName: null,													// Nur für Sach- oder Gemeinschaftskonto
				ktoBemerkung: 'Dietmar ist Nautiker',			// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: 'Herr',											// Welche Person hat etwas gebucht		
				ktoVorName: 'Dietmar',		 							
				ktoNachName: 'Peterson',
				ktoStrasse: 'Corneliastr. 22',						// Strasse
				ktoPLZ: '40483',												// PLZ
				ktoOrt: 'Düsseldorf',										// Ort
				ktoLand: 'Deutschland',									// Land
				ktoTel: '0211 09876568',									// Telefon
				ktoEmail: 'dietmar.peterson@t-online.dex',	// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: 'Stadtsparkasse Düsseldorf',			// Bankname
				ktoBIC:	'GEPKJUUZT',										// BIC
				ktoIBAN: 'DE93746908769876',							// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum				
				ktoPicture: null												// Photo
			});
						
			// _______ Sachkonten
			//
			viaJournalDB_085.insert("Konten", {
				code: '0bf79a7308f2e692178e9eecfb0f7974', 	// MD5-Code aus ktoName: 'Sachen,Proviant'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Proviant/Lebensmittel',		 								// Sachkonto Proviant
				ktoBemerkung: 'Essen & Trinken für Segeltörn',	// Bemerkung				
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur wenn Bankkonto angegeben
				ktoNachName: null,				
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: 'eb6c153f9b4a3db7d3ea38d794b7c9e3', 	// MD5-Code aus ktoName: 'Sachen,Chartergebühren'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Chartergebühren',		 					// Sachkonto Chartergebühren
				ktoBemerkung: 'Kosten für Charter eines Schiffes',	// Bemerkung				
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Besitzer des Bankkontos
				ktoNachName: null,	
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum				
				ktoPicture: null												// Photo	
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: '3d5e2939a49bbd31be98e2192154bbc6', 	// MD5-Code aus ktoName: 'Sachen,Hafengebühren'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Hafengebühren',		 						// Sachkonto Hafengebühren
				ktoBemerkung: 'Kosten für Schiff im Hafen',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur für Personenkonto...
				ktoNachName: null,					
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: 'afe843679e2056a2d0c54e752014ebd5', 	// MD5-Code aus ktoName: 'Sachen,Betriebskosten Schiff'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Betriebskosten Schiff',					// Sachkonto Betriebskosten Schiff
				ktoBemerkung: 'Tanken, Oel oder Gas fürs Schiff',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur für Personenkonto...
				ktoNachName: null,					
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});			
			//
			viaJournalDB_085.insert("Konten", {
				code: 'a27afd8cdea07d0a05c8ac5043130125', 	// MD5-Code aus ktoName: 'Sachen,Hafenkneipe'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Hafenkneipe/Bar',		 					// Sachkonto Hafenkneipe
				ktoBemerkung: 'Kaffee, Drinks & Snacks im Hafenbereich',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur für Personenkonto...
				ktoNachName: null,					
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: '8fdd5e3cab54e708b06bf5813744fe40', 	// MD5-Code aus ktoName: 'Sachen,Amüsieren/Ausgehen'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Amüsieren/Ausgehen',		 				// Sachkonto Amüsieren/Ausgehen
				ktoBemerkung: 'Restaurant, Bar oder Club',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur für Personenkonto...
				ktoNachName: null,					
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: 'd797ac0043276f70865f1c7a2d612024', 	// MD5-Code aus ktoName: 'Sachen,An-/Abreise'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Fahrtkosten, An-/Abreise',								// Sachkonto An-/Abreise
				ktoBemerkung: 'Fahrtkosten wie Tickets oder Tanken',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur für Personenkonto...
				ktoNachName: null,					
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: '429b2c3c651effb564b1785d1acd2e71', 	// MD5-Code aus ktoName: 'Sachen,Vercharterer'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Vercharterer',								// Sachkonto Vercharterer/Charteragentur
				ktoBemerkung: 'Vercharterer / Charteragentur des Schiffes',		// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur für Personenkonto...
				ktoNachName: null,					
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: '8f8f56084707c3543167de2397799d3f', 	// MD5-Code aus ktoName: 'Sachen,Diverses'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Sachen',											// Ident für Sachkonto
				ktoName: 'Diverses',										// Sachkonto An-/Abreise
				ktoBemerkung: 'Keinen konkreten Dingen zuordenbar',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Welche Person hat etwas gebucht		
				ktoVorName: null,		 									// Nur für Personenkonto...
				ktoNachName: null,					
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum					
				ktoPicture: null												// Photo
			});
															
			// _______ Fonds-/Gemeinschaftskonten
			//
			viaJournalDB_085.insert("Konten", {
				code: '226b0af5edd13ba3e12069bdc707ab2a', 	// MD5-Code aus ktoIdent und ktoName: 'Fonds,Bordkasse'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Fonds',											// Ident für Gemeinschaftskonto
				ktoName: 'Bargeldkasse',								// gemeinschaftliche Bordkasse für einen Törn
				ktoBemerkung: 'Gemeinsame Bargeld-Bordkasse',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Nur für Personenkonto...		
				ktoVorName: null,											// Besitzer des Bankkontos
				ktoNachName: null,
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum						
				ktoPicture: null												// Photo		
			});
			//
			viaJournalDB_085.insert("Konten", {
				code: 'db1f5ac83630941fa6f92d9165dd015c', 	// MD5-Code aus ktoIdent und ktoName: 'Fonds,Kaution'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				ktoIdent: 'Fonds',											// Ident für Gemeinschaftskonto
				ktoName: 'Kaution',											// gemeinschaftliche Bordkasse für einen Törn
				ktoBemerkung: 'Finanzielle Absicherung des Vercharterers',	// Bemerkung
				ktoCompany: null,											// ggf. kann eine Firma/natürliche Person auch eingetragen werden
				ktoAnrede: null,												// Nur für Personenkonto...		
				ktoVorName: null,											// Besitzer des Bankkontos
				ktoNachName: null,
				ktoStrasse: null,											// Strasse
				ktoPLZ: null,													// PLZ
				ktoOrt: null,													// Ort
				ktoLand: null,													// Land
				ktoTel: null,													// Telefon
				ktoEmail: null,												// Email
				ktoBankUser: null,											// Konto Halter bei Abweichungen von Vor-/NachNamne
				ktoBank: null,													// Optional ist das Konto ein Bankkonto
				ktoBIC:	null,													// BIC
				ktoIBAN: null,													// IBAN
				ktoCCInstitut: null,										// CreditCard Institute: VISA, Mastercard etc.
				ktoCCUser: null,												// CC Halter
				ktoCCNummer: null,											// CC Nummer
				ktoCCCode: null, 											// CC 3-stelliger Code
				ktoCCDatum: null,											// CC Ablaufdatum						
				ktoPicture: null												// Photo		
			});
			
			viaJournalDB_085.commit();	
			
			// _______ Hier werden alle Transaktionen/Buchungen geführt
			//
			viaJournalDB_085.createTable("Transaktionen", ["code", "datum", "transJournal", "transDatum", "transName", "transOrt", "transBetrag", "transCurrency", "transVon", "transNach", "transGPS", "transPicture"]);
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '43035a7e6672f80a270975fc47a0e159', 	// MD5-Code aus datum und transJournal: '20140608T103342Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140608T113342Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',	// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-07',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Peter in Bordkasse',					// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '250.00',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Kroatische Kuna
				transVon: '96f36e2980b7dab934718ad84d20a3eb',	// code der Person oder Fond von dem die Zahlung kommt. Hier: 'Peter Findus'
				transNach: '226b0af5edd13ba3e12069bdc707ab2a',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Fond: 'Bordkasse'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '84a5d79061506cfd617d91b01c1d7cc3', 	//MD5-Code aus datum und transJournal: '20140608T123445Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140608T121445Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',	// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-08',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Ulrich in Bordkasse',				// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '150.00',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'EUR' Kroatische Kuna
				transVon: 'eaa45bc10048cd3bdbd3b69c20c20070',	// code der Person oder Fond von dem die Zahlung kommt. Hier: 'Ulrich Meier'
				transNach: '226b0af5edd13ba3e12069bdc707ab2a',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Fond: 'Bordkasse'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '1f7c8673bde19ea5bea8580f262932ff', 	// MD5-Code aus datum und transJournal: '20140609T093547Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140609T163547Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',	// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-08',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Malte in Bordkasse',					// Buchung einer Transaktion mit Namen
				transOrt: 'Unije',											// Buchung des Ortes der Transaktion
				transBetrag: '900.00',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Kroatische Kuna
				transVon: '36be6add86ee56b69f2a3d33625637da',	// code der Person oder Fond von dem die Zahlung kommt. Hier: 'Malte Schuster'
				transNach: '226b0af5edd13ba3e12069bdc707ab2a',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Fond: 'Bordkasse'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});		
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '056fb92b9fc0fb20427e51898c4b825f', 	//MD5-Code aus datum und transJournal: '20140608T131545Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140608T131545Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',	// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-08',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Einkauf Proviant Grundausstatung',			// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '765.25',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Kroatische Kuna
				transVon: 'eaa45bc10048cd3bdbd3b69c20c20070',	// code der Person oder Fond von dem die Zahlung kommt. Hier: 'Ulrich Meier'
				transNach: '0bf79a7308f2e692178e9eecfb0f7974',	// Einzahlung in Sachenkonto. Hier Sachen: 'Proviant'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '44cf5b3801dd64186e9ee7b1c7301e72', 	//MD5-Code aus datum und transJournal: '20140608T092724Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140608T092724Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',				// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-07',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Dietmar - Anteil Kaution',		// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '250.00',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'EUR' Euro
				transVon: 'ca911fe43425ba4fb76719a8299ed6d0',	// code der Person oder Fond von dem die Zahlung kommt. Hier: 'Dietmar Peterson'
				transNach: 'db1f5ac83630941fa6f92d9165dd015c',	// Einzahlung in Sachenkonto. Hier Fond: 'Kaution'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '827bcbf144fc19545426d5c3b8eefca9', 	//MD5-Code aus datum und transJournal: '20140609T161445Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140609T161445Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',	// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-09',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Hafengebühr in Unije',				// Buchung einer Transaktion mit Namen
				transOrt: 'Unije',											// Buchung des Ortes der Transaktion
				transBetrag: '225.60',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Kroatische Kuna
				transVon: '226b0af5edd13ba3e12069bdc707ab2a',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Bordkasse'
				transNach: '3d5e2939a49bbd31be98e2192154bbc6',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Sachen: 'Hafengebühren'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'b0f7304fcd92793d0a56dd0ad76eef92', 	//MD5-Code aus datum und transJournal: '20140609T111647Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140609T111647Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',	// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-09',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Brötchen, Marmelade für Frühstück',		// Buchung einer Transaktion mit Namen
				transOrt: 'Unije',											// Buchung des Ortes der Transaktion
				transBetrag: '225.60',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Kroatische Kuna
				transVon: '226b0af5edd13ba3e12069bdc707ab2a',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Bordkasse'
				transNach: '0bf79a7308f2e692178e9eecfb0f7974',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Sachen: 'Proviant'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '727de98f7c12052c52ddf97dd782e728', 	//MD5-Code aus datum und transJournal: '20140609T211911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140609T211911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-09',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Bier und Snack am Abend in der Stadt',		// Buchung einer Transaktion mit Namen
				transOrt: 'Unije',											// Buchung des Ortes der Transaktion
				transBetrag: '225.60',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Kroatische Kuna
				transVon: '226b0af5edd13ba3e12069bdc707ab2a',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Bordkasse'
				transNach: 'a27afd8cdea07d0a05c8ac5043130125',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Sachen: 'Hafenkneipe'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '1f7c8673bde19ekiu7a8580f262932ff', 	// MD5-Code aus datum und transJournal: '20140609T093547Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140609T193647Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',	// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-09',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Peter in Bordkasse',					// Buchung einer Transaktion mit Namen
				transOrt: 'Unije',											// Buchung des Ortes der Transaktion
				transBetrag: '150.00',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'HRK' Kroatische Kuna
				transVon: '96f36e2980b7dab934718ad84d20a3eb',	// code der Person oder Fond von dem die Zahlung kommt. Hier: 'Malte Schuster'
				transNach: '226b0af5edd13ba3e12069bdc707ab2a',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Fond: 'Bordkasse'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});		
			//			
			viaJournalDB_085.insert("Transaktionen", {
				code: 'affb69fbb1f23e61bf0d0710d90f22b2', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140620T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-07',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Malte - Anteil Kaution',			// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '250.00',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'EUR' Euro
				transVon: '36be6add86ee56b69f2a3d33625637da',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: 'db1f5ac83630941fa6f92d9165dd015c',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'db2140137ea0bda04e6589ceeb105d1a', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140620T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-07',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Peter - Anteil Kaution',			// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '250.00',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'EUR' Euro
				transVon: '96f36e2980b7dab934718ad84d20a3eb',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: 'db1f5ac83630941fa6f92d9165dd015c',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'db2140137ea0bda04e6576ceeb105d1a', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140620T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-07',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Ulrich - Anteil Kaution',			// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '250.00',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'EUR' Euro
				transVon: 'eaa45bc10048cd3bdbd3b69c20c20070',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: 'db1f5ac83630941fa6f92d9165dd015c',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '621aaf0fa69d71a678298d7ea0714ca6', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140614T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-14',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Segelreparatur',							// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '125.00',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'EUR' Euro
				transVon: 'db1f5ac83630941fa6f92d9165dd015c',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '3c12a3b5104709b15e3ae2b7351fef76',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '80ed4df8858fd5cecc6cd7df3e74a101', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140610T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-10',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Hafengebühren Mali Lojini',							// Buchung einer Transaktion mit Namen
				transOrt: 'Mali Lojini Hafen',						// Buchung des Ortes der Transaktion
				transBetrag: '325.75',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Euro
				transVon: '226b0af5edd13ba3e12069bdc707ab2a',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '3d5e2939a49bbd31be98e2192154bbc6',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'd5cf949ac93d284ba4bc1d0b330c5b9d', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140610T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-10',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Hafengebühren Cres',					// Buchung einer Transaktion mit Namen
				transOrt: 'Cres Hafen',											// Buchung des Ortes der Transaktion
				transBetrag: '385.00',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Euro
				transVon: '226b0af5edd13ba3e12069bdc707ab2a',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '3d5e2939a49bbd31be98e2192154bbc6',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'e3da50b98fb11b4e1658d41d98522931', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140613T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-13',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Abschlussessen in Hafenrestaurant',					// Buchung einer Transaktion mit Namen
				transOrt: 'Pula Veruda Hafen',											// Buchung des Ortes der Transaktion
				transBetrag: '965.00',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Euro
				transVon: '226b0af5edd13ba3e12069bdc707ab2a',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '8fdd5e3cab54e708b06bf5813744fe40',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: '53dba7c271169b90bab27276a4aebbc3', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140611T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-11',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Brötchen/Baguette',					// Buchung einer Transaktion mit Namen
				transOrt: 'Ces Bäckerei',											// Buchung des Ortes der Transaktion
				transBetrag: '125.50',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Euro
				transVon: 'eaa45bc10048cd3bdbd3b69c20c20070',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '0bf79a7308f2e692178e9eecfb0f7974',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'c9a58badcb5b510a01196bf5eaefaa0b', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140611T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-11',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Kaffee/Tee',					// Buchung einer Transaktion mit Namen
				transOrt: 'Cres',											// Buchung des Ortes der Transaktion
				transBetrag: '125.50',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Euro
				transVon: '96f36e2980b7dab934718ad84d20a3eb',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '0bf79a7308f2e692178e9eecfb0f7974',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'c7381add2293cb03ed993f10ad0ee3ef', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140613T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-11',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Teil-Rückzahlung an Ulrich',	// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '218.75',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'HRK' Euro
				transVon: 'db1f5ac83630941fa6f92d9165dd015c',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: 'eaa45bc10048cd3bdbd3b69c20c20070',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'c7381add9948cb03ed993f10ad0ee3ef', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140613T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-11',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Teil-Rückzahlung an Peter',		// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '218.75',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'HRK' Euro
				transVon: 'db1f5ac83630941fa6f92d9165dd015c',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '96f36e2980b7dab934718ad84d20a3eb',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'c7381add875dcb03ed993f10ad0ee3ef', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140613T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-11',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Teil-Rückzahlung an Malte',		// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '218.75',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'HRK' Euro
				transVon: 'db1f5ac83630941fa6f92d9165dd015c',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: '36be6add86ee56b69f2a3d33625637da',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//
			viaJournalDB_085.insert("Transaktionen", {
				code: 'c7381add875dcb03ed754a10ad0ee3ef', 	//MD5-Code aus datum und transJournal: '20140620T170911Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140613T170911Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-11',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Teil-Rückzahlung an Dietmar',			// Buchung einer Transaktion mit Namen
				transOrt: 'Pula',											// Buchung des Ortes der Transaktion
				transBetrag: '218.75',									// Buchungsbetrag
				transCurrency: 'EUR',									// Währung in 'HRK' Euro
				transVon: 'db1f5ac83630941fa6f92d9165dd015c',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Kaution'
				transNach: 'ca911fe43425ba4fb76719a8299ed6d0',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Person: 'Dietmar Peterson'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
			//

			viaJournalDB_085.insert("Transaktionen", {
				code: 'acf16253d6def39283cb232e365f50a5', 	//MD5-Code aus datum und transJournal: '20140620T181210Z,6d6ddccd530242f132e3680b1bbaf4e9'
				datum: '20140620T181210Z', 							// aktuelles Anlagedatum in UTC
				transJournal: '7aad57ee447f51970d3ed77a67f85176',		// Zugehörigkeit zum Journal: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				transDatum: '2014-06-13',								// Buchung zum Datum mit lokaler Uhrzeit im ISO Format
				transName: 'Auffüllen Diesel an Tankstelle',					// Buchung einer Transaktion mit Namen
				transOrt: 'Mali Loinje',													// Buchung des Ortes der Transaktion
				transBetrag: '768.00',									// Buchungsbetrag
				transCurrency: 'HRK',									// Währung in 'HRK' Kroatische Kuna
				transVon: '226b0af5edd13ba3e12069bdc707ab2a',	// code der Person oder Fond von dem die Zahlung kommt. Hier Fond: 'Bordkasse'
				transNach: 'afe843679e2056a2d0c54e752014ebd5',	// Einzahlung in Fond/Gemeinschaftskonto. Hier Sachen: 'Betriebskosten Schiff'
				transGPS: null,												// GPS-Position von der Buchung
				transPicture: null											// ggf. Photo von der Buchung (Einkaufskorb, etc.)
			});
								
			viaJournalDB_085.commit();		

			// _______ Hier werden die Wechselkurse der Fremdwährungen geführt
			//
			viaJournalDB_085.createTable("Wechselkurse", ["code", "datum", "kursVon", "kursVonBez", "kursNach", "kursNachBez", "kursWert"]);
			//
			viaJournalDB_085.insert("Wechselkurse", {
				code: 'acb09a532f359ec3eeb3867a1cd5a9b9', 	// MD5-Code aus kursVon und kursNach: 'EUR,USD'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				kursVon: 'EUR',		 										// Kurs von Währung zu
				kursVonBez: 'Euro',
				kursNach: 'USD',												// Kurs nach Währung
				kursNachBez: 'US Dollar',
				kursWert: '1.359'											// Wert/Höhe des Kursverhältnisses	
			});
			//
			viaJournalDB_085.insert("Wechselkurse", {
				code: '5e6bf9a5cbaa7bda1591c853c97546ed', 	// MD5-Code aus kursVon und kursNach: 'EUR,HRK'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				kursVon: 'EUR',		 										// Kurs von Währung zu
				kursVonBez: 'Euro',
				kursNach: 'HRK',												// Kurs nach Währung
				kursNachBez: 'Kroatische Kuna',
				kursWert: '7.626'											// Wert/Höhe des Kursverhältnisses	
			});
			//
			viaJournalDB_085.insert("Wechselkurse", {
				code: 'e902f478b16780e767bb2218e1337d31', 	// MD5-Code aus kursVon und kursNach: 'EUR,TRY'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				kursVon: 'EUR',		 										// Kurs von Währung zu
				kursVonBez: 'Euro',
				kursNach: 'TRY',												// Kurs nach Währung
				kursNachBez: 'Türkische Lira',
				kursWert: '2.904'											// Wert/Höhe des Kursverhältnisses	
			});
			//
			viaJournalDB_085.insert("Wechselkurse", {
				code: '2179aa289960d583419186a2ed16ab5e', 	// MD5-Code aus kursVon und kursNach: 'EUR,DKK'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				kursVon: 'EUR',		 										// Kurs von Währungs-Kurzzeichen
				kursVonBez: 'Euro',
				kursNach: 'DKK',												// Kurs nach Währungs-Kurzzeichen
				kursNachBez: 'Dänische Kronen',
				kursWert: '7.454'											// Wert/Höhe des Kursverhältnisses	
			});
			//
			viaJournalDB_085.insert("Wechselkurse", {
				code: '915ae493059376b63f239c745f5a21db', 	// MD5-Code aus kursVon und kursNach: 'DKK,EUR'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				kursVon: 'DKK',		 										// Kurs von Währungs-Kurzzeichen
				kursVonBez: 'Dänische Kronen',
				kursNach: 'EUR',												// Kurs nach Währungs-Kurzzeichen
				kursNachBez: 'Euro',
				kursWert: '0.134'											// Wert/Höhe des Kursverhältnisses	
			});
			//
			viaJournalDB_085.insert("Wechselkurse", {
				code: '2cf4d9186e5eb144fc729c687fadeca7', 	// MD5-Code aus kursVon und kursNach: 'TRY,EUR'
				datum: $.getActualiCal('UTC'), 				// aktuelles Anlagedatum in UTC
				kursVon: 'TRY',		 										// Kurs von Währungs-Kurzzeichen
				kursVonBez: 'Türkische Lira',
				kursNach: 'EUR',												// Kurs nach Währungs-Kurzzeichen
				kursNachBez: 'Euro',
				kursWert: '0.352'											// Wert/Höhe des Kursverhältnisses	
			});			
			viaJournalDB_085.commit();
			
			// _______ Hier werden die Journale/Kassenbücher geführt
			//
			viaJournalDB_085.createTable("Journal", ["code", "datum", "journalStatus", "journalArchiv", "journalName", "journalBemerkung", "journalDatumVon", "journalDatumBis", "journalLeader", "journalTransaktionen", "journalKonten", "journalKurse", "journalPersonen", "journalCurrency", "journalPicture"]);
			//
			viaJournalDB_085.insert("Journal", {
				code: '7aad57ee447f51970d3ed77a67f85176', 	// MD5-Code aus journalName, journalDatumVon, journalDatumBis: 'Bordkasse Törn Kroatien,2014-06-07,2014-06-21'
				datum: $.getActualiCal('UTC'), 					// aktuelles Anlagedatum in UTC
				journalStatus: null,
				journalArchiv: null,
				journalName: 'Bordkasse Törn Kroatien',		// Name des Journales
				journalBemerkung: 'Unser Segeltörn Kroatien 2014',	// zusätzliche Bemerkung
				journalDatumVon: '2014-06-07',						// Abrechnungs Start des Journals
				journalDatumBis: '2014-06-14',						// Abrechnungs Ende des Journals
				journalLeader: 'eaa45bc10048cd3bdbd3b69c20c20070',	// Wer führt das Journal  - Ulrich Meier
				journalTransaktionen: [],								// Array der Transaktionen die zum Journal gebucht werden
				journalKonten: ["0bf79a7308f2e692178e9eecfb0f7974", "eb6c153f9b4a3db7d3ea38d794b7c9e3", "3d5e2939a49bbd31be98e2192154bbc6", "afe843679e2056a2d0c54e752014ebd5", "a27afd8cdea07d0a05c8ac5043130125", "8fdd5e3cab54e708b06bf5813744fe40", "d797ac0043276f70865f1c7a2d612024", "429b2c3c651effb564b1785d1acd2e71", "8f8f56084707c3543167de2397799d3f", "226b0af5edd13ba3e12069bdc707ab2a", "db1f5ac83630941fa6f92d9165dd015c"],		// Array der Gemeinschafs- und Sachkonten die benutzt werden
				journalKurse: [],												// Array der Wechselkurse die benutzt werden
				journalPersonen: ["eaa45bc10048cd3bdbd3b69c20c20070","96f36e2980b7dab934718ad84d20a3eb","36be6add86ee56b69f2a3d33625637da","ca911fe43425ba4fb76719a8299ed6d0"],		// Array der Teilnehmer/Personen sie mitgemacht haben
				journalCurrency: 'EUR',									// Referenzwährung
				journalPicture: null
			});	
						
			viaJournalDB_085.commit();	
			
		}	
	}
}


function openDB() {
	viaJournalDB_085 = new localStorageDB("viaJournal_085", localStorage);
}
	

/** 
 * Feststellen welches Device genutzt wird
 *
 * Bsp: 
 *       alert('Device: ' + Device.iOS());
 *       if(Device.mobile() { ... }  // für alle Smartdevices
 *
 */

var Device = {
	detect: function(key) {
		if(this['_'+key] === undefined) { this['_'+key] = navigator.userAgent.match(new RegExp(key, 'i')); }
		return this['_'+key];
	},
	iPhone: function() { return this.detect('iPhone'); },
	iPod: function() { return this.detect('iPod'); },
	iPad: function() { return this.detect('iPad'); },
	android: function() { return this.detect('Android'); },
	blackberry: function() { return this.detect('BlackBerry'); },
	mac: function() { return this.detect('Macintosh'); },
	winPhone: function() { return this.detect('Windows Phone'); },
	webOS: function() { return this.detect('webOS'); },
	iOS: function() { return this.iPhone() || this.iPod() || this.iPad(); },
	mobile: function() { return this.iOS() || this.android() || this.webOS() || this.blackberry(); },
	desktop: function() { return this.mac(); }
};			
			

/**
 * rounds number to X decimal places, defaults to 2
 *
 */
function round(num, X) {
	X = (!X ? 2 : X);
	return Math.round(num * Math.pow(10, X)) / Math.pow(10, X);
}

/**
 * Doppelte Einträge aus einem Array "origArr" entfernen
 *
 */
var uniqueArr = function(origArr) {
	var newArr = [],
		origLen = origArr.length,
		found,
		x, y;
	for(x = 0; x < origLen; x++) {
		found = undefined;
		for(y = 0; y < newArr.length; y++) {
			if (origArr[x] === newArr[y]) {
				found = true;
				break;
			}
		}
		if (!found) newArr.push(origArr[x]);   
	}
	return newArr;
}

/**
 * Zwei Arrays "a" und "b" miteinander verbinden und dabei doppelte löschen
 *
 * Bsp.:
 *     var a = [1, 2, 3, 'a', 'b', 'c'];
 *     var b = [2, 3, 4, 'b', 'c', 'd'];
 *     a = union(a, b);   //> [1, 2, 3, "a", "b", "c", 4, "d"]
 */
var union = function(a, b) {
  for (var i = 0; i < b.length; i++)
    if (a.indexOf(b[i]) === -1)
      a.push(b[i]);
  return uniqueArr(a);			// doppelte Einträge aus dem Gesamtarray nochmals löschen
};


/**
 * Komma durch Punkt ersetzen
 *
 * Bsp.:
 *     var a = '1200,00';
 *     a = convertDot(a);   //> '1200.00'
 */
var convertDot = function(a) {
	return a.replace(/,/, '.');		//Komma durch Punkt ersetzen
};


/** 
 * Ergänzt einen String um die Version am Anfang des Strings
 *
 * Bsp:
 *      "Daimler Benz" -> "(1) Daimler Benz"
 *
 * Es sind maximal 9 Versionen möglich
 * 
 * Rückgabewert: der ergänzte String oder 'false' 
 *
 */
function stringVersion(str) {

	var nameNeu;
	var leftPart = str.substr(0, 4);					// Ab Position 0 die ersten 4 Zeichen einlesen, ggf: "(1) Name..."
	var suche = /\(|\)/g;										// nach linker oder rechten runden Klammer suchen
															
	if(suche.test(leftPart)) {								// wenn eine Kopie gefunden "true", dann muss Zahl incrementiert werden
		var neuSuche = /^\((\w*)\)/;						// Zahl extrahieren - Suchmuster für Werte innerhalb von runden Klammern
		var num = neuSuche.exec(leftPart);			//	 Anwenden auf den gespeicherten Namen		
		var neuNum = parseInt(num[1]) + 1;			// Zahl um 1 erhöhen
		if(neuNum > 9) {
			return false;
		}
		var strNum = '(' + neuNum + ')';				// erhöhte Zahl in Klammern einpacken	
		var rightPart = str.slice(3);					// Stringbereich rechts von der Version
		nameNeu = strNum + rightPart;					// Neuen Namen zusammensetzen			
	} else { nameNeu = '(1) ' + str; }				// Erste Kopie
	
	return nameNeu;
}

/**
 * Abbild der sprintf-Perl Funktion
 *
 */
function sprintf( ) {
	// Return a formatted string  
	// 
	// version: 903.3016
	// discuss at: http://phpjs.org/functions/sprintf
	// +   original by: Ash Searle (http://hexmen.com/blog/)
	// + namespaced by: Michael White (http://getsprink.com)
	// +    tweaked by: Jack
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +      input by: Paulo Ricardo F. Santos
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +      input by: Brett Zamir (http://brettz9.blogspot.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// *     example 1: sprintf("%01.2f", 123.1);
	// *     returns 1: 123.10
	// *     example 2: sprintf("[%10s]", 'monkey');
	// *     returns 2: '[    monkey]'
	// *     example 3: sprintf("[%'#10s]", 'monkey');
	// *     returns 3: '[####monkey]'
	var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
	var a = arguments, i = 0, format = a[i++];

	// pad()
	var pad = function(str, len, chr, leftJustify) {
		if (!chr) chr = ' ';
		var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
		return leftJustify ? str + padding : padding + str;
	};

	// justify()
	var justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
		var diff = minWidth - value.length;
		if (diff > 0) {
			if (leftJustify || !zeroPad) {
				value = pad(value, minWidth, customPadChar, leftJustify);
			} else {
				value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
			}
		}
		return value;
	};

	// formatBaseX()
	var formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
		// Note: casts negative numbers to positive ones
		var number = value >>> 0;
		prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
		value = prefix + pad(number.toString(base), precision || 0, '0', false);
		return justify(value, prefix, leftJustify, minWidth, zeroPad);
	};

	// formatString()
	var formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
		if (precision != null) {
			value = value.slice(0, precision);
		}
		return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
	};

	// doFormat()
	var doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
		var number;
		var prefix;
		var method;
		var textTransform;
		var value;

		if (substring == '%%') return '%';

		// parse flags
		var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
		var flagsl = flags.length;
		for (var j = 0; flags && j < flagsl; j++) switch (flags.charAt(j)) {
			case ' ': positivePrefix = ' '; break;
			case '+': positivePrefix = '+'; break;
			case '-': leftJustify = true; break;
			case "'": customPadChar = flags.charAt(j+1); break;
			case '0': zeroPad = true; break;
			case '#': prefixBaseX = true; break;
		}

		// parameters may be null, undefined, empty-string or real valued
		// we want to ignore null, undefined and empty-string values
		if (!minWidth) {
			minWidth = 0;
		} else if (minWidth == '*') {
			minWidth = +a[i++];
		} else if (minWidth.charAt(0) == '*') {
			minWidth = +a[minWidth.slice(1, -1)];
		} else {
			minWidth = +minWidth;
		}

		// Note: undocumented perl feature:
		if (minWidth < 0) {
			minWidth = -minWidth;
			leftJustify = true;
		}

		if (!isFinite(minWidth)) {
			throw new Error('sprintf: (minimum-)width must be finite');
		}

		if (!precision) {
			precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void(0);
		} else if (precision == '*') {
			precision = +a[i++];
		} else if (precision.charAt(0) == '*') {
			precision = +a[precision.slice(1, -1)];
		} else {
			precision = +precision;
		}

		// grab value using valueIndex if required?
		value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

		switch (type) {
			case 's': return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
			case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
			case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
			case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'i':
			case 'd': {
				number = parseInt(+value);
				prefix = number < 0 ? '-' : positivePrefix;
				value = prefix + pad(String(Math.abs(number)), precision, '0', false);
				return justify(value, prefix, leftJustify, minWidth, zeroPad);
			}
			case 'e':
			case 'E':
			case 'f':
			case 'F':
			case 'g':
			case 'G': {
				number = +value;
				prefix = number < 0 ? '-' : positivePrefix;
				method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
				textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
				value = prefix + Math.abs(number)[method](precision);
				return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
			}
			default: return substring;
			}
	};

	return format.replace(regex, doFormat);
}


/**
 *  number_format 
 *  Formatiert eine Zahl mit Tausender-Gruppierung und fester Anzahl von Nachkommastellen 
 *
 *  Aufruf:
 *     number_format ( number, 
 *                     decimals = 2, 
 *                     dec_point = ',', 
 *                     thousands_sep = '.' )
 *
 *  number
 *    Die zu formatierende Zahl als string oder numeral. Muss im Format Englische Notation "1,234.56" 
 *    oder "1000.00" übergeben werden.
 *
 *  decimal [optional] (default: 2 /kaufmännisch)
 *    Dieser Parameter bestimmt, ob die formatierte Zahl eine feste Anzahl von Nachkommastellen 
 *    haben soll.
 *
 *  dec_point (optional) (default: '.')
 *    Dieser Parameter bestimmt mit welchem Delimiter die tausender Stellen getrennt werden sollen.
 *	
 *  thousand_sep (optional) (default: ',')
 *    Dieser Parameter bestimmt mit welchem Delimiter die Nachkommastellen getrennt werden sollen.
 *
 *	  Bsp: 
 *    number = 1234.56;
 *
 *  Rückgabewert ist ein String
 *
 *    Deutsche Notation 
 *       german_format_number = number_format(number, 0, '.', ','); => 1.235,56
 * 
 *    Englische Notation
 *       english_format_number = number_format(number); => 1,235.56
 *
 *    Franzoesische Notation
 *       nombre_format_francais = number_format(number, 2, ',', ' '); => 1 234,56
 *
 *    number = 1234.5678;
 *
 *    Englische Notation ohne Tausendergruppierung (default)
 *       english_format_number = number_format(number, 2, '.', ''); =>  1234.57
 *
 *    http://javascript.jstruebig.de/javascript/37
 */
function number_format(numeral, decimals, dec_point, thousands_sep) {

	// Wenn nur die Zahl als Parameter übergeben wird,
	//	 dann wird mit 2 Dezimalstellen, in der Englischen Notation ohne Tausendergruppierung dargestellt.
	if(!decimals) { decimals = 2; }
	if(!dec_point) { dec_point = '.'; }
	if(!thousands_sep) { thousands_sep = ''; }
	
	var neu = '';
	var minus = false;
	var decNullen = '00000000000000000000'.substr(0, decimals);

	// Negatives Numeral
	if(round(numeral, decimals) < 0) { 
		numeral *= -1;		// positiv machen
		minus = true;		// minus flag setzen
	}
	
	// Runden
	var f = Math.pow(10, decimals);
	numeral = '' + parseInt(numeral * f + (.5 * (numeral > 0 ? 1: -1))) / f;
	
	
	// Komma ermittlen
	var idx = numeral.indexOf('.');

	// fehlende Nullen einfügen
	if(idx != -1) { numeral += (idx == -1 ? '.' : '') + f.toString().substring(1); }

	// Nachkommastellen ermittlen
	idx = numeral.indexOf('.');
	if(idx == -1) {		// Suche war erfolglos 
		idx = numeral.length;
		neu = (decNullen != '') ? dec_point + decNullen : '';		// Wenn keine Dezimalnullen, dann wird auch kein Trennzeichen angezeigt
	} else { neu = (decNullen != '') ? dec_point + numeral.substr(idx + 1, decimals) : ''; }

	// Tausendertrennzeichen
	while(idx > 0) {
		if(idx - 3 > 0) { neu = thousands_sep + numeral.substring(idx - 3, idx) + neu; }
		else { neu = numeral.substring(0, idx) + neu; }
		idx -= 3;
	}

	// Wenn Numeral negativ war, Minus-Zeichen anhängen	
	return neu = (minus) ? '-' + neu : neu;
}


////////////////////////////////////////////////////////////////////////////////
// jQuery Plugins
////////////////////////////////////////////////////////////////////////////////
	
/**
 * jQuery getActualiCal plugin
 *
 *  Copyright (c) 2012 Friedhelm Koch (service at vialinked.com)
 *  Not under Open Source License!
 * 
 *  Aktuelles Datum in UTC oder Local im iCal Format ISO 8601
 *  
 *  Parameter: 
 *  	  - UTC ohne Zeit: ( Bsp: $.getActualiCal('UTC', woTime); )
 *      Rückgabe: jjjjmmdd = 20120512
 *       
 *    - UTC mit Zeit: ( Bsp: $.getActualiCal('UTC'); )
 *      Rückgabe: jjjjmmddThhmmssZ = 20120512T131603Z 
 *         
 *    - Local ohne Zeit: ( Bsp: $.getActualiCal('Local', true); )
 *      Rückgabe: jjjjmmdd = 20120512
 *
 *    - Local ohne Zeit im ISO Format: ( Bsp: $.getActualiCal('Local', true, true); )
 *      Rückgabe: jjjj-mm-dd = 2012-05-12
 *       
 *    - Local mit Zeit: ( Bsp: $.getActualiCal('Local'); )
 *      Rückgabe: jjjjmmddThhmmss = 20120512T131603
 *                   
 *    - kein Parameter: ( Bsp: $.getActualiCal(); )
 *      Rückgabe Local mit Zeit: jjjjmmddThhmmssZ = 20120512T131603Z      	    
 */
;(function($) {
	$.getActualiCal = function (UTC, woTime, ISO) {
	
		// Delimiter im ISO-Format-8601 für Datum: '-' und Zeit: ':'
		var delD = (/undefined/.test(ISO)) ? '' : '-';
		var delT = (/undefined/.test(ISO)) ? '' : ':'; 
		   
		var dt = new Date();
		var yyyy = (/UTC/i.test(UTC)) ? dt.getUTCFullYear() : dt.getFullYear();
		var mm = dt.getUTCMonth()+1;
		if (mm <= 9) { mm = "0" + mm; }
		var dd = (/UTC/i.test(UTC)) ? dt.getUTCDate() : dt.getDate();
		if (dd <= 9) { dd = "0" + dd; }
		var hh = (/UTC/i.test(UTC)) ? dt.getUTCHours() : dt.getHours();
		if (hh <= 9) { hh = "0" + hh; }
		var mi = (/UTC/i.test(UTC)) ? dt.getUTCMinutes() : dt.getMinutes();
		if (mi <= 9) { mi = "0" + mi; }
		var ss = (/UTC/i.test(UTC)) ? dt.getUTCSeconds() : dt.getSeconds();
		if (ss <= 9) { ss = "0" + ss; }
		
		// wenn DT undefiniert, dann iCal komplett, ansonsten nur das Datum zurückgeben
		if(/UTC/i.test(UTC)) {
			var DT = (/undefined/.test(woTime)) ? yyyy + delD + mm + delD + dd + 'T' + hh + delT + mi + delT + ss + 'Z' : yyyy + delD + mm + delD + dd;
		} else {
			var DT = (/undefined/.test(woTime)) ? yyyy + delD + mm + delD + dd + 'T' + hh + delT + mi + delT + ss : yyyy + delD + mm + delD + dd;
		}
		return DT;
		
	};
})(jQuery);

	
/**
 * jQuery Cookie plugin
 *
 * Funktion zum Schreiben und Lesen von Cookies.
 * Parallel werden die 'Cookies' auch in einem LocalStorage Objekt gespeichert.
 * Dies unterstützt mit gleicher Funktionalität auch mobile lokale Apps. 
 *  
 * Copyright (c) 2012 Friedhelm Koch (familykoch.de)
 * Not under Open Source License!
 *   
 *  Übergabeparameter: 
 *          - Cookie-Name
 *          - Inhalt des Cookie
 *          - Laufzeit des Cookie
 *
 *  Konfiguration:
 *        $.cookie.raw = true;   // Cookie wird encoded/decoded
 *        $.cookie.json = true;  // Cookie wird als JSON Objekt übertragen
 *           
 *
 *  Cookie schreiben:
 *     Cookie mit Laufzeit von 7 Tagen, mit/ohne URLencode:
 *        var status = $.cookie('cookie_name', 'inhalt', { expires: 7 });
 *        var status = $.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
 *
 *  Bsp. mit allen Optionen:
 *     $.cookie("test", 1, {
 *        expires : 10,            //expires in 10 days
 *        path    : '/',           //The value of the path attribute of the cookie 
 *                                 //(default: path of page that created the cookie).
 *        domain  : 'jquery.com',  //The value of the domain attribute of the cookie
 *                                 //(default: domain of page that created the cookie).
 *        secure  : true           //If set to true the secure attribute of the cookie
 *                                 //will be set and the cookie transmission will
 *                                 //require a secure protocol (defaults to false).
 *     });  
 *
 *     Session Cookie:
 *        var status = $.cookie('cookie_name', 'inhalt');
 *
 *     Cookie auslesen:
 *        var status = $.cookie('cookie_name');  // => Value
 *        // Wenn Cookie nicht existiert
 *        var status = $.cookie('not_existing'); // => null
 *
 *     Löschen eines Cookie:
 *        $.cookie('cookie_name', 'null'); 
 *           oder
 *        $.removeCookie('the_cookie');
 *        // Wenn Optionen angegeben wurde dann NUR mit gleichen Optionen löschbar:
 *        $.removeCookie('the_cookie', { path: '/' });
 *
 */
(function ($, document, undefined) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (value === null) {
				options.expires = -1;
				if(typeof(Storage) !== "undefined") {   // LocalStorage Objekt parallel löschen
					if(config.raw) { localStorage.removeItem(decoded(key)); }
					else { localStorage.removeItem(key); }
				}	
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);
	
			if(typeof(Storage) !== "undefined") {   // LocalStorage Objekt parallel speichern
				if(value !== 'null') {
					if(config.raw) { localStorage.setItem(encodeURIComponent(key), encodeURIComponent(value)); } 
					else { localStorage.setItem(key, value); }
				}
			}
			
			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		
		if(typeof(Storage) !== "undefined") {   // LocalStorage Objekt parallel auslesen
			if(config.raw) { cookie = localStorage.getItem(decoded(key)); } 
			else { cookie = localStorage.getItem(key); }
		}
			
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			
			if (decode(parts.shift()) === key) {
				var cookie = decode(parts.join('='));
				return config.json ? JSON.parse(cookie) : cookie;
			}
		}

		return null;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== null) {
			$.cookie(key, null, options);
			return true;
		}
		return false;
	};

})(jQuery, document);


/**
 * jQuery Translate plugin
 *
 *  Copyright (c) 2012 Friedhelm Koch
 *  Not under Open Source License!
 *  
 *  !!! Aufruf geschieht oben im document.ready  
 *
 **/  

	;(function($) {

    // Technically these should be scoped into a data() pseudo-namespace
    var translate_path;
    var translate_name;
    var translate_lang;
    var translate_data = {};
    var translate_eids = {};

    // string = $.translate(key)
    // Returns the translated value for a given key.
    $.translate = function (key) {
			if (translate_data[key]) return translate_data[key];
    }

    // $.translateInit(path, name)
    // Initializes the translate plugin with the path to the language files
    // and the base filename. No return value, but the getLang method will                          
    // be primed with the browser's default language, which could be used with
    // the load method.
    //
    // path
    // This is a simple path, such as /mysite/language/ ... For now, the plugin
    // assumes the formatting is correct and there is a trailing slash.
    //
    // name
    // This is the root name for the localization files. One- or two-part language
    // codes as per RFC 4646 (http://www.ietf.org/rfc/rfc4646.txt) are expected,
    // such as "en" for generic English, or "en-US" for American English versus
    // "en-AU" for Australian English. These are appended to the root name after
    // a dash. If your root filename was "profile", the Australian English version
    // would be "profile-en-AU.txt". For now, the plugin assumes the language files
    // use a .lang filename extension. A more convenient list of valid culture codes
    // is: http://sharpertutorials.com/list-of-culture-codes/
		//
    $.translateInit = function (path, name) {
        if (typeof path != 'string' || typeof name != 'string') {
            $.error('Invalid or missing parameter calling jQuery.translate init method.');
        } else {
        	if($.cookie('Language')) {
						translate_lang = $.cookie('Language');        	
        	} else {
            translate_lang = normalizeLang(navigator.language || navigator.userLanguage);
            // --------------------------- ^^ Mozilla            ^^ IE
          }
          translate_path = path;
          translate_name = name;
        }
        //alert('path = ' + translate_path + ', name = ' + translate_name + ', lang = ' + translate_lang);
    }

    // string = $.translateGetLanguage()
    // Returns the most recently language that the plugin attempted to load.
    $.translateGetLanguage = function () {
    		//alert('lang = ' + translate_lang);
        return translate_lang;
    }

    // $.translateLoad(language)
    // Retrieves the specified language file. This will autmatically degrade a specific
    // variant (such as fr-CA) to a generic variant (such as fr) and then to the default
    // non-language-specific base file if the language variants are not found. The demo
    // illustrates this behavior with the en-CA and ru languages. No return value.
    // Comments and blank lines are stripped, and #-prefixed names stored in a separate
    // array for automated processing as HTML element IDs.
    $.translateLoad = function (language) { return doLoad(language) }
    function doLoad(language) {
        if (typeof translate_path != 'string' || typeof translate_name != 'string') {
            $.error('jQuery.translate load method called prior to initialization.');
        } else {
            var lang = normalizeLang(language);
            var opts = { async: false, cache: false, dataType: 'text', timeout: 500 };
            var query;
            var file = "";

            // Load the language file and degrade along the way...
            if (lang.length >= 5) {														// z.B: 'en-US'
                query = $.ajax($.extend(opts, { url: translate_path + translate_name + '-' + lang.substring(0, 5) + '.lang' }));
                if (query.status == 200) file = query.responseText;
            }
            if (file.length == 0 && lang.length >= 2) {				// z.B: 'de'
                query = $.ajax($.extend(opts, { url: translate_path + translate_name + '-' + lang.substring(0, 2) + '.lang' }));
                if (query.status == 200) file = query.responseText;
            }
            if (file.length == 0) {
                query = $.ajax($.extend(opts, { url: translate_path + translate_name + '.lang' }));
                if (query.status == 200) file = query.responseText;
            }

            // Turn the language file content into an associative array
            // This general idea borrowed from Acatl Pacheco's ResourceBundle plugin.
            var rawText = $.trim(file).split("\n");
            
            translate_data = {};
            translate_eids = {};
            for (var i = 0; i < rawText.length; i++) {
                var row = $.trim(rawText[i]);
                var sep = row.indexOf("\t");
                if (sep == -1) sep = row.indexOf(" ");
                if (sep >= 0) {
                    var datkey = $.trim(row.slice(0, sep));                 									// grab the key (trim to ignore blank lines)
                    if (datkey.substring(0, 2) != "//" && datkey.substring(0, 3) != "") {  // ignore comment lines and UTF-8 signature line                       
                        if (datkey.charAt(0) == "#") {
                            translate_data[datkey] = $.trim(row.slice(sep + 1)); 							// indiv. key/value pairs
                        } else {                          
                            translate_eids[datkey] = $.trim(row.slice(sep + 1)); 							// autom. element IDs
                        }
                    }
                }
            }
        }
    }

    
    
    // $.translateUpdateElements()
    // Assuming the language file contained #-prefixed names, the assoc array will
    // be populated with the #-prefixed values that were parsed from the language
    // file. 
    $.translateUpdateElements = function () { return doUpdateElements() }
    function doUpdateElements() {
			$.each(translate_eids, function (key, value) {
				$('.'+key).html(value);
				//alert('Element Key= ' + key + ', Value= ' + value);
			});
    }

    // $.translateLoadAutoUpdate(language)
    // This just wraps the load function and the updateElements function so that
    // the caller can run both with a single command in the front-end code.
    $.translateLoadAutoUpdate = function (language) {
        var dat = doLoad(language);
        doUpdateElements();
    }

    // Ensure language code is in the format aa-AA.
    function normalizeLang(language) {
        language = language.replace(/_/, '-').toLowerCase();
        if (language.length > 3) language = language.substring(0, 3) + language.substring(3).toUpperCase();
        return language;
    }

	})(jQuery);

// EOF