/*!
 * 
 * Copyright (c) 2014 Friedhelm Koch
 *
 * This file is part of viaLinked Project. It is subject to the license terms 
 * in the LICENSE file found in the top-level directory of this distribution 
 * and at http://www.viaLinked.com/license.html. 
 * No part of viaLinked Project, including this file, may be copied, modified, 
 * propagated, or distributed except according to the terms contained in the 
 * LICENSE file.
 *
 */
 
			///////////
			// Standard Javascript Funktionen
			////////////////////////////////////////////	
	
			// Globale Variablen
			var viaJournalDB_085,		// Datenbank in der Version 0.8.5
				recFonds,							// Hier werden Datenbankrecords gespeichert
				urlPara,
				transVonEmail = [],		// Email Adressen aller Beteiligter
				offZahlungPers = [],	// Array mit Personen, die noch negative offene Zahlungen zu leisten haben 
				refCurrency = '',
				journalName = '',
				journalLeaderName = '',
				LZ = '  ',
				LZ4 = LZ+LZ,
				LZ10 = '               ';

			///////////
			// Erst wenn DOM geladen
			////////////////////////////////////////////		
			
			$(document).ready(function() {

				// __________ Globale Variablen
				//

				iOSversion();				// Header für iOS7 anpassen
				openDB();						// Initialisierte Datenbank öffnen
				showReports();			// Den zum Journal gehörenden report anzeigen


				// _________ Report per Mail versenden
				//	
				//
				$('.Email').click(function () {
				
					// Lokale Variablen
					var teilnehmer = [],		// Array mit allen Teilnehmern eines Journals
						bankinfos = '',			// Bankinformationen aller teilnehmer eines Journals
						bankinfos_mail = '',
						tel = '',
						tel_mail = '',
						minusPersonen = '',
						minusPersonen_txt = '',
						zahlungenArr = [];
						
//					if(!Device.mobile()) {
//						alert('Email wird im Web nicht supported!');
//						return false;
//					}

					// Aus Journal alle Teilnehmer ermitteln
					var recJournal = viaJournalDB_085.query("Journal");
					for(var j=0 in recJournal) {
						if(recJournal[j].code == urlPara[1]) {	
							teilnehmer = recJournal[j].journalPersonen;
						}
					}
															
					// Bankkontendaten ermitteln
					//
					var recKonten = viaJournalDB_085.query("Konten");
				
					// Für alle Teilnehmer und deren Bankkontendaten ermitteln
					for(var i=0 in recKonten) {
						for(var j=0 in teilnehmer) {
							if(teilnehmer[j] == recKonten[i].code) {
								var titel = (recKonten[i].ktoBemerkung) ? ' (' + recKonten[i].ktoBemerkung + ')' : '';
								var tel = (recKonten[i].ktoTel) ? 'Telefon: ' + recKonten[i].ktoTel + '</br>' : '';
								var tel_mail = (recKonten[i].ktoTel) ? LZ + 'Telefon: ' + recKonten[i].ktoTel + '\n' : '';
								bankinfos += '<span style="font-size:.8em">' +
									recKonten[i].ktoVorName + ' ' + recKonten[i].ktoNachName + titel + '</br>' +
									
									tel +
									
									'Bank: ' + recKonten[i].ktoBank + '<br />' +
									'BIC/BLZ: ' + recKonten[i].ktoBIC + '<br />' +
									'IBAN/Kto: ' + recKonten[i].ktoIBAN + '</span>' +
									'<hr size="1px" align="left" width="50%" color="#c0c0c0" noshade>';
													
								bankinfos_mail += recKonten[i].ktoVorName + ' ' + recKonten[i].ktoNachName + titel + '\n' +
													
									tel_mail +
													
									LZ + 'Bank: ' + recKonten[i].ktoBank + '\n' +
									LZ + 'BIC/BLZ: ' + recKonten[i].ktoBIC + '\n' +
									LZ + 'IBAN/Kto: ' + recKonten[i].ktoIBAN + '\n' +
									'----------------------\n';
							} 
						}
					}
	
					// Für alle weiteren Konten, deren Bankdaten (IBAN) angegeben wurden
					for(var i=0 in recKonten) {						
						if(recKonten[i].ktoIBAN && recKonten[i].ktoIdent != 'Personen') {
							bankinfos += '<span style="font-size:.8em">' +
								recKonten[i].ktoName + '<br />' +
								'Kto-Inhaber: ' + recKonten[i].ktoName + '<br />' +
								'Bank: ' + recKonten[i].ktoBank + '<br />' +
								'BIC/BLZ: ' + recKonten[i].ktoBIC + '<br />' +
								'IBAN/Kto: ' + recKonten[i].ktoIBAN + '</span>' +
								'<hr size="1px" align="left" width="50%" color="#c0c0c0" noshade>';
													
							bankinfos_mail += recKonten[i].ktoName + '\n' +
								LZ + 'Kto-Inhaber: ' + recKonten[i].ktoName + '\n' +
								LZ + 'Bank: ' + recKonten[i].ktoBank + '\n' +
								LZ + 'BIC/BLZ: ' + recKonten[i].ktoBIC + '\n' +
								LZ + 'IBAN/Kto: ' + recKonten[i].ktoIBAN + '\n' +
								'----------------------\n';
						}
					}

					// offene Zahlungen in assoziatives Array konvertieren
					var j = 0;																					// Anfangszähler für neues Array
					for(var i=0 in offZahlungPers) {						
						var z = offZahlungPers[i].split(';');							// Betrag und Name mit ';' getrennt
						if(parseFloat(round(z[0], 2)) != 0) {
							zahlungenArr[j] = [];
							zahlungenArr[j] = {'betrag':parseFloat(z[0]), 'name':z[1]};	// Assoziatives Array
							j++;
						}
					}
													
					// offene Zahlungen nach 'betrag' absteigend sortieren
					zahlungenArr.sort(function(a, b){  
						var a = a.betrag, b = b.betrag;
						return(a == b) ? 0 : (a > b) ? -1 : 1;	// !!! mit: "-1 und 1" vertauschen für aufsteigend sortieren
					});

//					DEBUG	Code				
//					var tmp = '';
//					for(var i=0 in zahlungenArr) {
//						tmp += zahlungenArr[i]['betrag'] + '\n';
//					}
//					alert('L: ' + zahlungenArr.length + '\n' + tmp);
							
					var anzahl = zahlungenArr.length - 1;		// Anzahl Teilnehmer inkl. 0 !!!
					var j = 0;
					
					do {
	
						if(parseFloat(zahlungenArr[anzahl]['betrag']) <= 0.00) {
						
							var rest = parseFloat(zahlungenArr[anzahl]['betrag']) + parseFloat(zahlungenArr[j]['betrag']);
							
							if(rest < 0) {
										
								minusPersonen += '<li>' + zahlungenArr[anzahl]['name'] + ' zahlt: ' + number_format(zahlungenArr[j]['betrag'], 2, ',', '.') + ' ' + refCurrency + ' an: ' + zahlungenArr[j]['name'] + '</li>';
								minusPersonen_txt += '- ' + zahlungenArr[anzahl]['name'] + ' zahlt: ' + number_format(zahlungenArr[j]['betrag'], 2, ',', '.') + ' ' + refCurrency + ' an: ' + zahlungenArr[j]['name'] + '\n';

								var tmpZahl = zahlungenArr[anzahl]['betrag'];
								zahlungenArr[anzahl]['betrag'] = rest;
								zahlungenArr[j]['betrag'] = tmpZahl + parseFloat(zahlungenArr[j]['betrag']) - rest;

//							alert('rest <0\n j: ' + j + ', anzahl: ' + anzahl + ', rest: ' + number_format(rest) + '\n' + minusPersonen);

								j++;
								
							} else {
						
								minusPersonen += '<li>' + zahlungenArr[anzahl]['name'] + ' zahlt: ' + number_format(zahlungenArr[anzahl]['betrag'] * -1, 2, ',', '.') + ' ' + refCurrency + ' an: ' + zahlungenArr[j]['name'] + '</li>';
								minusPersonen_txt += '- ' + zahlungenArr[anzahl]['name'] + ' zahlt: ' + number_format(zahlungenArr[anzahl]['betrag'] * -1, 2, ',', '.') + ' ' + refCurrency + ' an: ' + zahlungenArr[j]['name'] + '\n';

								var tmpZahl = zahlungenArr[anzahl]['betrag'];
								zahlungenArr[anzahl]['betrag'] = parseFloat(zahlungenArr[anzahl]['betrag']) - parseFloat(zahlungenArr[anzahl]['betrag']);
								zahlungenArr[j]['betrag'] = parseFloat(zahlungenArr[j]['betrag']) + tmpZahl;

//							alert('rest >0\n j: ' + j + ', anzahl: ' + anzahl + ', rest: ' + number_format(rest) + '\n' + minusPersonen);

								anzahl--;
								
							}

						} else {
													
							j++;
							minusPersonen = 'tbd...';
													
						}
						
//						DEBUG	Code					
//						var tmp = '';
//						for(var i=0 in zahlungenArr) {
//							tmp += zahlungenArr[i]['betrag'] + '\n';
//						}
//						alert('L: ' + zahlungenArr.length + '\n' + tmp);
						
					} while(j < anzahl);

                          
					anschreiben_txt = 'Liebes Team,\n' +
						'anbei die Abrechnung zu: *** ' + journalName + ' ***\n\n' +
													
						'Im oberen Teil der Abrechnung seht ihr in einer Übersicht alle Ausgaben und Einnahmen für alle Gruppen- und Personenkonten, sowie deren Überschüsse (Saldi).' +
						'Besteht ein "Überschuss", sind also die Ausgaben ungleich der Einnahmen, dann ist das Konto: "Soll zu Haben" nicht ausgeglichen. Ein positiver Überschuss (auch Soll-Saldo) bedeutet, dass mehr ausgegeben wurde, als eingenommen wurde.' +
						'Die noch "offene Zahlung" ergibt sich aus den "Ausgaben pro PAX" minus dem persönlichen "Überschuss". Eine negative offene Zahlung bedeutet demnach, dass diejenige Person noch eine Zahlung in der entsprechenden Höhe zu leisten hat!\n\n' +

						'Diejenige Person, die das Kassenbuch verwaltet, hat als Ausnahme den Überschuss der Gruppen-/Gemeinschaftskonten übernommen. Dieser Überschuss verrechnet sich natürlich mit seiner persönlichen, entweder positiven oder negativen offenen Zahlung. Dies verringert oder erhöht ggf. seine Zahlung die er noch zu leisten, oder zu bekommen hat. Die Zahlungen können mit einer oder mehreren Personen verrechnet werden die eine positive offene Zahlung (also zu viel gezahlt) hat.\n\n' +

						'Wurden für die einzelnen Teilnehmer des Kassenbuches Bankdaten hinterlegt, finden die sich am Ende dieser Abrechnung. ' +
						'Im weiteren Verlauf der Abrechnung befinden sich Übersichten über die einzelnen Ausgabe-, Einnahmenkonten und deren konsolidierten Sachaufwendungen. Weiter unten sind dann noch einmal alle Einzelbuchungen aufgeführt.\n\n' +
													
						'Der Zahlungsplan sieht somit folgendermaßen aus:\n' +
								
						minusPersonen_txt.replace(/&/gi,'+') + '\n' +

						'Sollte es weitere Fragen dazu geben, bitte Feedback an mich.\n\nDanke und beste Grüße,\n' +
													
						journalLeaderName.replace(/&/gi,'+') +
													
						'\n\n===============================\n' +
													
						$("#mailReport_Header").text().replace(/&/gi,'+') +
													
						'*** KONTEN ***\n===============================\nAusgaben\n----------------------\n' +
						$("#mailReport_KontenAusgaben").text().replace(/&/gi,'+') +
													
						'----------------------\nEinnahmen\n----------------------\n' +
						$("#mailReport_KontenEinnahmen").text().replace(/&/gi,'+') +
													
						'----------------------\nSachaufwand\n----------------------\n' +
						$("#mailReport_KontenSachen").text().replace(/&/gi,'+') +
													
						'\n===============================\n*** JOURNAL (chronologisch) ***\n===============================\n' +
						$("#mailReport_reportJournal").text().replace(/&/gi,'+') +
													
						'\n===============================\n*** Teilnehmer Bankinfos ***\n===============================\n' +
						bankinfos_mail.replace(/&/gi,'+');
													
													
		
					// Anschreiben
					//
					anschreiben = '<span style="font-size:.8em">' + 
						'<p>Liebes Team,</p>' +
						'<p>anbei die Abrechnung zu: "' + journalName + '".</p>' +
						'<p>Im oberen Teil der Abrechnung seht ihr in einer Übersicht alle Ausgaben und Einnahmen für alle Gruppen- und Personenkonten, sowie deren Überschüsse (Saldi).</p>' +
						'<p>Besteht ein "Überschuss", sind also die Ausgaben ungleich der Einnahmen, dann ist das Konto: "Soll zu Haben" nicht ausgeglichen. Ein positiver Überschuss (auch Soll-Saldo) bedeutet, dass mehr ausgegeben wurde, als eingenommen wurde.</p>' +
						'<p>Die noch "offene Zahlung" ergibt sich aus den "Ausgaben pro PAX" minus dem persönlichen "Überschuss". Eine negative offene Zahlung bedeutet demnach, dass diejenige Person noch eine Zahlung in der entsprechenden Höhe zu leisten hat!</p>' +
						'<p>Diejenige Person, die das Kassenbuch verwaltet, hat als Ausnahme den Überschuss der Gruppen-/Gemeinschaftskonten übernommen. Dieser Überschuss verrechnet sich natürlich mit seiner persönlichen, entweder positiven oder negativen offenen Zahlung. Dies verringert oder erhöht ggf. seine Zahlung die er noch zu leisten, oder zu bekommen hat. Die Zahlungen können mit einer oder mehreren Personen verrechnet werden die eine positive offene Zahlung (also zu viel gezahlt) hat.</p>' +
						'<p>Wurden für die einzelnen Teilnehmer des Kassenbuches Bankdaten hinterlegt, finden die sich am Ende dieser Abrechnung.</p>' +
						'<p>Im weiteren Verlauf der Abrechnung befinden sich Übersichten über die einzelnen Ausgabe-, Einnahmenkonten und deren konsolidierten Sachaufwendungen. Weiter unten sind dann noch einmal alle Einzelbuchungen aufgeführt.</p>' +
						'<p>Damit haben zu zahlen:</br>' +
						'<ul>' +
                          
						encodeURIComponent(minusPersonen) +
						
						'</ul>' +
						'<p>Sollte es weitere Fragen dazu geben, bitte Feedback an mich.</p><p>Danke und beste Grüße,</br>' +
						journalLeaderName + '</br></br></p><hr size="1px" align="left" width="50%" color="#c0c0c0" noshade>' +
						'</span>'; 

					// Email Variablen			
					var header = $("#mailHeader").html(),			
						toField = transVonEmail,
						ccField = [], 
						bccField = [], 
						subField = 'Abrechnung für: ' + journalName,
						attachment = [];		// Array mit kompletten Pfadangabe zur Datei Bsp: ['./img/icon_info.jpg']
 
					var bodyField =
						'<style>' +
							'body { font:12pt/110% Arial; font-size:1.0em; }' +
							'td { float:left; text-align:left; font-size: 1.3em;}' +
							'/* Header, Content, Footer */' +
							'	.ui-header, .ui-content, .ui-controlgroup, .ui-footer, .ui-controlgroup {' +
    					'	font-size: 1.4em;' +
							'}' +
						'</style>' +
							
						'<p>' + 
						
						anschreiben +
						
						'<table border="0" width="100%" cellspacing="0" cellpadding="0">' +
						
						'<tr><td>' +

						$("#mailArea").html() +
						
						'</td></tr>' +
						
						'<tr><td>' +
						'<p style="font-size:1.2em"><b>Bankinformationen</b></p>' +
						
						bankinfos +
						
						'</td></tr>' +
						
						'<tr><td style="background-image:url(http://viajournal.vialinked.com/img/viaJournal_at_AppStore_Tagline_horizontal.png); background-repeat:no-repeat; height:42px;" >' +
						'</td></tr>' +
				
						'</table>' +
						'</p>';

          var bodyField =
                          
	
//					if(Device.mobile()) {
		
						// ______ Plugin GitHub: <https://github.com/katzer/cordova-plugin-email-composer/tree/f4fcee88c47c7ac642cceb27d3d8b31edd26a8f6>
						//
						// Attachments - Beispiele
						// attachments: ['base64:icon.png//iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/...'] als Data URI oder
						// attachments: [
   			 	  //      'absolute://Users/sebastian/Library/Application Support/iPhone Simulator/7.0.3/Applications/E7981856-801F-4355-8687-EAACDF8B2A54/HelloCordova.app/../Documents/icon.jpg"'
						//      'relative://resources/icons/icon.jpg'
   				 	//      ]
//						window.plugin.email.open({
//							to: toField,
//							cc: ccField,
//							bcc: bccField,
//							subject: subField,
//							body: bodyField,
//							isHtml: true
//						});
                        
//					}
          
//          alert(bodyField);
													
						// Der Unterschied zwischen encodeURI und encodeURIComponent liegt in einer Differenz von 11 Zeichen. Während encodeURI die Sonderzeichen eines Query-Strings in einer URL unangetastet lässt, verschlüsselt encodeURICompontent auch &, /, : und +.
            window.location.href='mailto:' + transVonEmail + '?subject=' + subField + '&body=' + encodeURI(anschreiben_txt);
													
					
				});

				// _________ Zurück-Button: von Buchungsübersicht zu entsprechendem Journal-Detail zurück
				//
				$('.link2journal').bind('click', function() {
					var rec;
					var urlPara = $(location).attr('href').split("?");		// URL auslesen, um mit Journal-Code weiterarbeiten zu können
					var recJ = viaJournalDB_085.query("Journal");				// Alle gespeicherten Journale auslesen
					for(var j=0 in recJ) {
						if(recJ[j].code == urlPara[1]) {
							rec = j;
						}
					}
					window.location.href='./index.html?' + rec;		// Workaround, da die zweite Seite in index nicht direkt aufgerufen werden kann
				});	

				return false;
				
			});

// EOF
