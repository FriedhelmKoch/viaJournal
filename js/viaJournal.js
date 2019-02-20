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


////////////////////////////////////////////////////////////////////////////////
// Alle "document ready" Funktionen
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
									
	// _________ Report per Mail versenden
	//
	//
	$('.Support_Email').click(function () {
									
		var body_text ='Sehr geehrtes viaJournal Team,\n\nwir hätten gerne folgende Funktion zusätzlich intergiert...\n\nWir möchten gerne folgenden Bug mitteilen...\n\nDanke und beste Grüsse,\n...';
		window.location.href='mailto:support@vialinked.com?subject=Verbesserungsvorschlag / Bug-Report&body=' + encodeURI(body_text);
														
	});

	return false;
					
}); // Ende Document.Ready


////////////////////////////////////////////////////////////////////////////////
// JavaScript - Funktionen
////////////////////////////////////////////////////////////////////////////////

	
//
// _________ Gespeicherte Konto Personendaten anzeigen
//
function showKtoPersonen() { 
								
	// Alle gespeicherten Konto Personendaten auslesen
	//
	recPersonen = viaJournalDB_085.query("Konten");
				
	var output = '';
	
	for(var i=0 in recPersonen) {			// das gesamte gespeicherte Array durchlaufen
	
		if(recPersonen[i].ktoIdent == 'Personen') {

			// Laufvariable "i" wird als Attribut: "rec" übergeben
			output += '<li>' +
				'<a href="#" class="linkKtoIndividuals" rec="' + i + '">' +
					recPersonen[i].ktoVorName + ' ' + recPersonen[i].ktoNachName + 
					'</br><span style="font-size:.8em">' + recPersonen[i].ktoStrasse + ', ' + recPersonen[i].ktoPLZ + ' ' + recPersonen[i].ktoOrt + '</span>' +
				'</a>' +
			'</li>';

		}
		
	}
				
	// gespeicherte Berechnungen in Dashboard Listview ausgeben	
	$('#archivKtoPersonen').append(output).listview('refresh');

	// Wenn keine Daten vorhanden
	if(recPersonen === 0) { $('#message').append('Keine Daten vorhanden!'); } 
}
		
//
// _________ Gespeicherten Personendaten anzeigen und editieren
//
function editKtoIndividuals(i) {

	// Record# für weitere Funktionen auf Seiten div hinterlegen
	$("#KtoIndividualsPage").attr("rec", i);
			
	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KtoIndividualsPage", { 
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});
	
	// Bei den Key-Feldern für MD5-ID keine Änderungsmöglichkeit
	$('#ktoCompany').textinput({ disabled: true });
	$('#ktoVorName').textinput({ disabled: true });
	$('#ktoNachName').textinput({ disabled: true });
	$('#ktoPLZ').textinput({ disabled: true });
				
	// Setzen der Inputfelder aus Daten der Datenbanktabelle "ktoPersonen"
		
	// Alternative???
	// Erst alle aufheben
	//   $("#ktoAnrede option").attr('selected',true);
	// Dann setzen
	//   $("#ktoAnrede option[value=recPersonen[i].ktoAnrede]").prop('checked',true).selectmenu('refresh');
		
	// Select Button "Anrede" neu setzen und gleichzeitig refreshen
	if($("#ktoAnrede").val(recPersonen[i].ktoAnrede) == 'Herr') { $('#ktoAnrede').prop('checked', true).selectmenu('refresh');
	} else { $('#ktoAnrede').removeProp('checked').selectmenu('refresh'); }
	
	// Inputfelder aus Datenbank ersetzen
	$("#ktoName").val(null);
	$("#ktoBemerkung").val(recPersonen[i].ktoBemerkung);	
	$("#ktoCompany").val(recPersonen[i].ktoCompany);
	$("#ktoAnrede").val(recPersonen[i].ktoAnrede);
	$("#ktoVorName").val(recPersonen[i].ktoVorName);
	$("#ktoNachName").val(recPersonen[i].ktoNachName);	
	$("#ktoStrasse").val(recPersonen[i].ktoStrasse);
	$("#ktoPLZ").val(recPersonen[i].ktoPLZ);
	$("#ktoOrt").val(recPersonen[i].ktoOrt);		
	$("#ktoLand").val(recPersonen[i].ktoLand);
	$("#ktoTel").val(recPersonen[i].ktoTel);
	$("#ktoEmail").val(recPersonen[i].ktoEmail);
	$("#ktoBank").val(recPersonen[i].ktoBank);		
	$("#ktoBIC").val(recPersonen[i].ktoBIC);		
	$("#ktoIBAN").val(recPersonen[i].ktoIBAN);
	
	// Navbar anpassen	
	$('.navbarFooter_modify').show();
	$('.navbarFooter_add').hide();
		
}

//
// _________ Gespeicherten Personendaten aus Datenbank löschen
//
function deleteKtoPersonen(i) {

	$('#delItem').text(recPersonen[i].ktoVorName + ' ' + recPersonen[i].ktoNachName);		// Itembeschreibung in Popup eintragen
	$("#delConfirm").popup("open");								// Confirm Popup open
	$('#delItemBtn').bind('click', function() {	
					
		// Löschen Personen aus Tabelle: "ktoPersonen" 
		viaJournalDB_085.deleteRows("Konten", function(row) {
			if(row.code == recPersonen[i].code) { return true; }
			else { return false; }
		});
		viaJournalDB_085.commit(); 								// Commit the deletions to localStorage
		
		$("#delConfirm").popup("close");							// Confirm Popup close

		window.location.href='./personen.html';			// Personen Seite aufrufen und damit page refresh		
		
	});

}

//
// _________ Personendaten in Datenbank speichern und/oder updaten
//
function saveKtoPersonen(i) {

	// _______ Validierung
	//
	// ID's of all required fields in Array
	var required = ["ktoVorName", "ktoNachName", "ktoPLZ"];
	// Validate required fields		
	for(var j=0 in required) {
		var input = $('#'+required[j]);
		if(!input.val() || input.val() == "") {
			$('.popValidation').html("Die mit einem Stern<sup>*</sup> gekennzeichneten Felder müssen ausgefüllt werden und können nachträglich nicht geändert werden!")
			$('#validation').popup("open");							// Confirm Validierung von zwingenden Eingabefeldern
			return;
		}
	}

	// Auf doppelten Eintrag prüfen
	// Beim Anlegen von neuen Personenn Konten wird "i" nicht übertragen !!!  
	if(i && recPersonen[i].code == MD5('Personen,,' + $("#ktoVorName").val() + ',' + $("#ktoNachName").val() + ',' + $("#ktoPLZ").val())) {
	
		$('#doubleCheck').popup("open");							// Confirm DoubleCheck des Entrags
		$('#doubleCheckBtn').bind('click', function() {	

			// Ist eine Person in Datenbank, dann update oder neu anlegen eines neuen Datensatzes
			viaJournalDB_085.insertOrUpdate("Konten", { 
				code: MD5('Personen,,' + $("#ktoVorName").val() + ',' + $("#ktoNachName").val() + ',' + $("#ktoPLZ").val()) 
				}, {
				code: MD5('Personen,,' + $("#ktoVorName").val() + ',' + $("#ktoNachName").val() + ',' + $("#ktoPLZ").val()),
				datum: $.getActualiCal('UTC'),							// Änderungsdatum
				ktoIdent: 'Personen',												// Konto-Ident 'Personen'
				ktoName: null,
				ktoBemerkung: $("#ktoBemerkung").val(),			// Bemerkung
				ktoCompany: null,													// Company derzeit nicht benutzt
				ktoAnrede: $("#ktoAnrede").val(),						// Anrede auslesen...
				ktoVorName: $("#ktoVorName").val(),					// Vorname
				ktoNachName: $("#ktoNachName").val(),				// Nachname
				ktoStrasse: $("#ktoStrasse").val(),					// Strasse
				ktoPLZ: $("#ktoPLZ").val(),									// PLZ
				ktoOrt: $("#ktoOrt").val(),									// Ort
				ktoLand: $("#ktoLand").val(),								// Land
				ktoTel: $("#ktoTel").val(),									// Telefon
				ktoEmail: $("#ktoEmail").val(),							// Email
				ktoBank: $("#ktoBank").val(),								// Bankname
				ktoBIC:	$("#ktoBIC").val(),									// BIC
				ktoIBAN: $("#ktoIBAN").val(),								// IBAN
				ktoPicture: null														// Photo
			});
			viaJournalDB_085.commit(); 									// Commit the update to localStorage

			$("#doubleCheck").popup("close");							// Confirm DoubleCheck close
			window.location.href='./personen.html';				// Personenkonto Seite aufrufen und damit page refresh

		});
				
	}	else {

		$('#popupSuccess').popup("open");							// Confirm popupSuccess open
		
		viaJournalDB_085.insertOrUpdate("Konten", { 
			code: MD5('Personen,,' + $("#ktoVorName").val() + ',' + $("#ktoNachName").val() + ',' + $("#ktoPLZ").val()) 
			}, {
			code: MD5('Personen,,' + $("#ktoVorName").val() + ',' + $("#ktoNachName").val() + ',' + $("#ktoPLZ").val()),
			datum: $.getActualiCal('UTC'),							// Änderungsdatum
			ktoIdent: 'Personen',												// Konto-Ident 'Personen'
			ktoName: null,
			ktoBemerkung: $("#ktoBemerkung").val(),			// Bemerkung
			ktoCompany: null,													// Company derzeit nicht benutzt
			ktoAnrede: $("#ktoAnrede").val(),						// Anrede auslesen...
			ktoVorName: $("#ktoVorName").val(),					// Vorname
			ktoNachName: $("#ktoNachName").val(),				// Nachname
			ktoStrasse: $("#ktoStrasse").val(),					// Strasse
			ktoPLZ: $("#ktoPLZ").val(),									// PLZ
			ktoOrt: $("#ktoOrt").val(),									// Ort
			ktoLand: $("#ktoLand").val(),								// Land
			ktoTel: $("#ktoTel").val(),									// Telefon
			ktoEmail: $("#ktoEmail").val(),							// Email
			ktoBank: $("#ktoBank").val(),								// Bankname
			ktoBIC:	$("#ktoBIC").val(),									// BIC
			ktoIBAN: $("#ktoIBAN").val(),								// IBAN
			ktoPicture: null														// Photo
		});
		viaJournalDB_085.commit(); 									// Commit the update to localStorage

		// Transaktionen Seite nach Wartezeit von 2000 Millisekunden aufrufen und damit page refresh
		setTimeout(function(){ window.location.href='./personen.html'; }, 2000);
		
	}		
}	

//
// _________ Neue Personen in Datenbank aufnehmen
//
function addKtoPersonen() {

	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KtoIndividualsPage", {
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});

	// Bei den Key-Feldern für MD5-ID Änderungsmöglichkeit aus "edit" wieder freigeben
	$('#ktoVorName').textinput({ disabled: false });
	$('#ktoNachName').textinput({ disabled: false });
	$('#ktoPLZ').textinput({ disabled: false });
		
	// Inputfelder nullen
	$("#ktoCompany").val(null);
	$("#ktoAnrede").val('Herr');
	$("#ktoVorName").val(null);
	$("#ktoNachName").val(null);
	$("#ktoBemerkung").val(null);		
	$("#ktoStrasse").val(null);
	$("#ktoPLZ").val(null);
	$("#ktoOrt").val(null);		
	$("#ktoLand").val(null);
	$("#ktoTel").val(null);
	$("#ktoEmail").val(null);
	$("#ktoBank").val(null);		
	$("#ktoBIC").val(null);		
	$("#ktoIBAN").val(null);
	
	$('ktoIndividuals').textinput("refresh" );
	
	// Navbar anpassen	
	$('.navbarFooter_modify').hide();
	$('.navbarFooter_add').show();	
	
}

//
// _________ Gespeicherte Konto Gemeinschaftskonten/Fonds anzeigen
//
function showKtoFonds() { 
								
	// Alle gespeicherten Konto Personendaten auslesen
	//
	recFonds = viaJournalDB_085.query("Konten");
				
	var output = '';
	
	for(var i=0 in recFonds) {			// das gesamte gespeicherte Array durchlaufen
	
		if(recFonds[i].ktoIdent == 'Fonds') {

			// Laufvariable "i" wird als Attribut: "rec" übergeben
			output += '<li>' +
				'<a href="#" class="linkKtoFondsDetail" rec="' + i + '">' +
					recFonds[i].ktoName + 
					'</br><span style="font-size:.8em">' + recFonds[i].ktoBemerkung + '</span>' +
				'</a>' +
			'</li>';
			
		}
		
	}
				
	// gespeicherte Berechnungen in Dashboard Listview ausgeben	
	$('#archivKtoFonds').append(output).listview('refresh');

	// Wenn keine Daten vorhanden
	if(recFonds === 0) { $('#message').append('Keine Daten vorhanden!'); } 
}

//
// _________ Gespeicherten Personendaten anzeigen und editieren
//

function editKtoFondsDetail(i) {

	// Record# für weitere Funktionen auf Seiten div hinterlegen
	$("#KtoFondsDetailPage").attr("rec", i);
			
	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KtoFondsDetailPage", { 
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});

	// Bei den Key-Feldern für MD5-ID keine Änderungsmöglichkeit
	$('#ktoName').textinput({ disabled: true });
				
	// Setzen der Inputfelder aus Daten der Datenbanktabelle "ktoPersonen"

	// Inputfelder aus Datenbank ersetzen
	$("#ktoName").val(recFonds[i].ktoName);
	$("#ktoBemerkung").val(recFonds[i].ktoBemerkung);		
	$("#ktoVorName").val(recFonds[i].ktoVorName);
	$("#ktoNachName").val(recFonds[i].ktoNachName);
	$("#ktoBank").val(recFonds[i].ktoBank);		
	$("#ktoBIC").val(recFonds[i].ktoBIC);		
	$("#ktoIBAN").val(recFonds[i].ktoIBAN);
	
	// Navbar anpassen	
	$('.navbarFooter_modify').show();
	$('.navbarFooter_add').hide();
		
}

//
// _________ Gespeicherten Fonds aus Datenbank löschen
//
function deleteKtoFonds(i) {

	$('#delItem').text(recFonds[i].ktoName);			// Itembeschreibung in Popup eintragen
	$("#delConfirm").popup("open");								// Confirm Popup open
	$('#delItemBtn').bind('click', function() {	
					
		// Löschen Personen aus Tabelle: "ktoPersonen" 
		viaJournalDB_085.deleteRows("Konten", function(row) {
			if(row.code == recFonds[i].code) { return true; }
			else { return false; }
		});
		viaJournalDB_085.commit(); 								// Commit the deletions to localStorage
		
		$("#delConfirm").popup("close");							// Confirm Popup close

		window.location.href='./fonds.html';			// Personen Seite aufrufen und damit page refresh		
		
	});

}

//
// _________ Fonds-/Gemeinschaftsdaten in Datenbank speichern und/oder updaten
//
function saveKtoFonds(i) {

	// _______ Validierung
	//
	// ID's of all required fields in Array
	var required = ["ktoName"];
	// Validate required fields		
	for(var j=0 in required) {
		var input = $('#'+required[j]);
		if(!input.val() || input.val() == "") {
			$('.popValidation').html("Die mit einem Stern<sup>*</sup> gekennzeichneten Felder müssen ausgefüllt werden und können nachträglich nicht geändert werden!")
			$('#validation').popup("open");							// Confirm Validierung von zwingenden Eingabefeldern
			return;
		}
	}

	// Auf doppelten Eintrag prüfen
	// Beim Anlegen von neuen Kursen wird "i" nicht übertragen !!!  
	if(i && recFonds[i].code == MD5('Fonds,' + $("#ktoName").val())) {
	
		$('#doubleCheck').popup("open");							// Confirm DoubleCheck des Entrags
		$('#doubleCheckBtn').bind('click', function() {	

			// Ist ein Fond in Datenbank, dann update oder neu anlegen eines neuen Datensatzes
			viaJournalDB_085.insertOrUpdate("Konten", { 
				code: MD5('Fonds,' + $("#ktoName").val()) 
				}, {
				code: MD5('Fonds,' + $("#ktoName").val()),
				datum: $.getActualiCal('UTC'),							// Änderungsdatum
				ktoIdent: 'Fonds',													// Konto-Ident 'Fonds'
				ktoName: $("#ktoName").val(),
				ktoBemerkung: $("#ktoBemerkung").val(),			// Bemerkung
				ktoCompany: null,													// Company derzeit nicht benutzt
				ktoAnrede: null,														// Anrede
				ktoVorName: $("#ktoVorName").val(),					// Vorname wenn Bank angegeben wurde
				ktoNachName: $("#ktoNachName").val(),				// Nachname
				ktoStrasse: null,													// Strasse
				ktoPLZ: null,															// PLZ
				ktoOrt: null,															// Ort
				ktoLand: null,															// Land
				ktoTel: null,															// Telefon
				ktoEmail: null,														// Email
				ktoBank: $("#ktoBank").val(),								// Bankname
				ktoBIC:	$("#ktoBIC").val(),									// BIC
				ktoIBAN: $("#ktoIBAN").val(),								// IBAN
				ktoPicture: null														// Photo
			});
			viaJournalDB_085.commit(); 									// Commit the update to localStorage
	
			$("#doubleCheck").popup("close");							// Confirm DoubleCheck close
			window.location.href='./fonds.html';					// Gemeinschaftskonto Seite aufrufen und damit page refresh

		});
				
	}	else {

		$('#popupSuccess').popup("open");							// Confirm popupSuccess open
		
		viaJournalDB_085.insertOrUpdate("Konten", { 
			code: MD5('Fonds,' + $("#ktoName").val()) 
			}, {
			code: MD5('Fonds,' + $("#ktoName").val()),
			datum: $.getActualiCal('UTC'),							// Änderungsdatum
			ktoIdent: 'Fonds',													// Konto-Ident 'Fonds'
			ktoName: $("#ktoName").val(),
			ktoBemerkung: $("#ktoBemerkung").val(),			// Bemerkung
			ktoCompany: null,													// Company derzeit nicht benutzt
			ktoAnrede: null,														// Anrede
			ktoVorName: $("#ktoVorName").val(),					// Vorname wenn Bank angegeben wurde
			ktoNachName: $("#ktoNachName").val(),				// Nachname
			ktoStrasse: null,													// Strasse
			ktoPLZ: null,															// PLZ
			ktoOrt: null,															// Ort
			ktoLand: null,															// Land
			ktoTel: null,															// Telefon
			ktoEmail: null,														// Email
			ktoBank: $("#ktoBank").val(),								// Bankname
			ktoBIC:	$("#ktoBIC").val(),									// BIC
			ktoIBAN: $("#ktoIBAN").val(),								// IBAN
			ktoPicture: null														// Photo
		});
		viaJournalDB_085.commit(); 									// Commit the update to localStorage

		// Transaktionen Seite nach Wartezeit von 2000 Millisekunden aufrufen und damit page refresh
		setTimeout(function(){ window.location.href='./fonds.html'; }, 2000);
		
	}		
}	




//
// _________ Neue FONDS in Datenbank aufnehmen
//
function addKtoFonds() {

	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KtoFondsDetailPage", {
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});
	
		// Bei den Key-Feldern für MD5-ID Änderungsmöglichkeit ggf. durch "edit" wieder freigeben
	$('#ktoName').textinput({ disabled: false });
	
	// Inputfelder nullen
	$("#ktoName").val(null);
	$("#ktoBemerkung").val(null);
	$("#ktoVorName").val(null);
	$("#ktoNachName").val(null);	
	$("#ktoBank").val(null);		
	$("#ktoBIC").val(null);		
	$("#ktoIBAN").val(null);
	
	$('ktoFondsDetail').textinput("refresh" );
	
	// Navbar anpassen	
	$('.navbarFooter_modify').hide();
	$('.navbarFooter_add').show();	
	
}

//
// _________ Gespeicherte Konto Sachenkonten anzeigen
//
function showKtoSachen() { 
								
	// Alle gespeicherten Konto Personendaten auslesen
	//
	recSachen = viaJournalDB_085.query("Konten");
				
	var output = '';
	
	for(var i=0 in recSachen) {			// das gesamte gespeicherte Array durchlaufen
	
		if(recSachen[i].ktoIdent == 'Sachen') {

			// Laufvariable "i" wird als Attribut: "rec" übergeben
			output += '<li>' +
				'<a href="#" class="linkKtoSachenDetail" rec="' + i + '">' +
					recSachen[i].ktoName + 
					'</br><span style="font-size:.8em">' + recSachen[i].ktoBemerkung + '</span>' +
				'</a>' +
			'</li>';
			
		}
		
	}
				
	// gespeicherte Konten in Dashboard Listview ausgeben	
	$('#archivKtoSachen').append(output).listview('refresh');

	// Wenn keine Daten vorhanden
	if(recSachen === 0) { $('#message').append('Keine Daten vorhanden!'); } 
}

//
// _________ Gespeicherten Sachkonten anzeigen und editieren
//
function editKtoSachenDetail(i) {

	// Record# für weitere Funktionen auf Seiten div hinterlegen
	$("#KtoSachenDetailPage").attr("rec", i);
			
	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KtoSachenDetailPage", { 
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});

	// Bei den Key-Feldern für MD5-ID keine Änderungsmöglichkeit
	$('#ktoName').textinput({ disabled: true });
				
	// Setzen der Inputfelder aus Daten der Datenbanktabelle "ktoPersonen"

	// Inputfelder aus Datenbank ersetzen
	$("#ktoName").val(recSachen[i].ktoName);
	$("#ktoBemerkung").val(recSachen[i].ktoBemerkung);		
	$("#ktoVorName").val(recSachen[i].ktoVorName);
	$("#ktoNachName").val(recSachen[i].ktoNachName);
	$("#ktoBank").val(recSachen[i].ktoBank);		
	$("#ktoBIC").val(recSachen[i].ktoBIC);		
	$("#ktoIBAN").val(recSachen[i].ktoIBAN);
	
	// Navbar anpassen	
	$('.navbarFooter_modify').show();
	$('.navbarFooter_add').hide();
		
}

//
// _________ Gespeicherte Sachkonten aus Datenbank löschen
//
function deleteKtoSachen(i) {

	$('#delItem').text(recSachen[i].ktoName);			// Itembeschreibung in Popup eintragen
	$("#delConfirm").popup("open");								// Confirm Popup open
	$('#delItemBtn').bind('click', function() {	
					
		// Löschen Personen aus Tabelle: "ktoPersonen" 
		viaJournalDB_085.deleteRows("Konten", function(row) {
			if(row.code == recSachen[i].code) { return true; }
			else { return false; }
		});
		viaJournalDB_085.commit(); 								// Commit the deletions to localStorage
		
		$("#delConfirm").popup("close");							// Confirm Popup close

		window.location.href='./sachen.html';			// Personen Seite aufrufen und damit page refresh		
		
	});

}

//
// _________ Sachkontendaten in Datenbank speichern und/oder updaten
//
function saveKtoSachen(i) {

	// _______ Validierung
	//
	// ID's of all required fields in Array
	var required = ["ktoName"];
	// Validate required fields		
	for(var j=0 in required) {
		var input = $('#'+required[j]);
		if(!input.val() || input.val() == "") {
			$('.popValidation').html("Die mit einem Stern<sup>*</sup> gekennzeichneten Felder müssen ausgefüllt werden und können nachträglich nicht geändert werden!")
			$('#validation').popup("open");							// Confirm Validierung von zwingenden Eingabefeldern
			return;
		}
	}

	// Auf doppelten Eintrag prüfen
	// Beim Anlegen von neuen Kursen wird "i" nicht übertragen !!!  
	if(i && recSachen[i].code == MD5('Sachen,' + $("#ktoName").val())) {
	
		$('#doubleCheck').popup("open");							// Confirm DoubleCheck des Entrags
		$('#doubleCheckBtn').bind('click', function() {	

			// Ist ein Sachenkonto in Datenbank, dann update oder neu anlegen eines neuen Datensatzes
			viaJournalDB_085.insertOrUpdate("Konten", { 
				code: MD5('Sachen,' + $("#ktoName").val()) 
			}, {
				code: MD5('Sachen,' + $("#ktoName").val()),
				datum: $.getActualiCal('UTC'),							// Änderungsdatum 
				ktoIdent: 'Sachen',													// Konto-Ident 'Sachen'
				ktoName: $("#ktoName").val(),
				ktoBemerkung: $("#ktoBemerkung").val(),			// Bemerkung
				ktoCompany: null,													// Company derzeit nicht benutzt
				ktoAnrede: null,														// Anrede
				ktoVorName: $("#ktoVorName").val(),					// Vorname wenn Bank angegeben wurde
				ktoNachName: $("#ktoNachName").val(),				// Nachname
				ktoStrasse: null,													// Strasse
				ktoPLZ: null,															// PLZ
				ktoOrt: null,															// Ort
				ktoLand: null,															// Land
				ktoTel: null,															// Telefon
				ktoEmail: null,														// Email
				ktoBank: $("#ktoBank").val(),								// Bankname
				ktoBIC:	$("#ktoBIC").val(),									// BIC
				ktoIBAN: $("#ktoIBAN").val(),								// IBAN
				ktoPicture: null														// Photo
			});
			viaJournalDB_085.commit(); 									// Commit the update to localStorage
			
			$("#doubleCheck").popup("close");							// Confirm DoubleCheck close
			window.location.href='./sachen.html';					// Sachenkonto Seite aufrufen und damit page refresh

		});
				
	}	else {

		$('#popupSuccess').popup("open");							// Confirm popupSuccess open
			
		// Ist ein Sachenkonto in Datenbank, dann update oder neu anlegen eines neuen Datensatzes
		viaJournalDB_085.insertOrUpdate("Konten", { 
			code: MD5($("#ktoName").val()) 
		}, {
			code: MD5($("#ktoName").val()),
			datum: $.getActualiCal('UTC'),							// Änderungsdatum 
			ktoIdent: 'Sachen',													// Konto-Ident 'Sachen'
			ktoName: $("#ktoName").val(),
			ktoBemerkung: $("#ktoBemerkung").val(),			// Bemerkung
			ktoCompany: null,													// Company derzeit nicht benutzt
			ktoAnrede: null,														// Anrede
			ktoVorName: $("#ktoVorName").val(),					// Vorname wenn Bank angegeben wurde
			ktoNachName: $("#ktoNachName").val(),				// Nachname
			ktoStrasse: null,													// Strasse
			ktoPLZ: null,															// PLZ
			ktoOrt: null,															// Ort
			ktoLand: null,															// Land
			ktoTel: null,															// Telefon
			ktoEmail: null,														// Email
			ktoBank: $("#ktoBank").val(),								// Bankname
			ktoBIC:	$("#ktoBIC").val(),									// BIC
			ktoIBAN: $("#ktoIBAN").val(),								// IBAN
			ktoPicture: null														// Photo
		});
		viaJournalDB_085.commit(); 									// Commit the update to localStorage
			
		// Transaktionen Seite nach Wartezeit von 2000 Millisekunden aufrufen und damit page refresh
		setTimeout(function(){ window.location.href='./sachen.html'; }, 2000);

	}		
}	

//
// _________ Neues Sachkonto in Datenbank aufnehmen
//
function addKtoSachen() {

	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KtoSachenDetailPage", {
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});
	
		// Bei den Key-Feldern für MD5-ID Änderungsmöglichkeit ggf. durch "edit" wieder freigeben
	$('#ktoName').textinput({ disabled: false });
	
	// Inputfelder nullen
	$("#ktoName").val(null);
	$("#ktoBemerkung").val(null);		
	$("#ktoVorName").val(null);
	$("#ktoNachName").val(null);
	$("#ktoBank").val(null);		
	$("#ktoBIC").val(null);		
	$("#ktoIBAN").val(null);
	
	$('ktoSachenDetail').textinput("refresh" );
	
	// Navbar anpassen	
	$('.navbarFooter_modify').hide();
	$('.navbarFooter_add').show();	
	
}

//
// _________ Gespeicherte Transaktionen anzeigen
//
function showKurse() { 
								
	// Alle gespeicherten Konto Personendaten auslesen
	//
	recKurse = viaJournalDB_085.query("Wechselkurse");
				
	var output = '';
	
	for(var i=0 in recKurse) {			// das gesamte gespeicherte Array durchlaufen

		// Laufvariable "i" wird als Attribut: "rec" übergeben
		output += '<li>' +
			'<a href="#" class="linkKurseDetail" rec="' + i + '">' +
				recKurse[i].kursVon + recKurse[i].kursNach + ' = ' + recKurse[i].kursWert +
				'</br><span style="font-size:.8em">' + recKurse[i].kursVonBez +  ' zu ' + recKurse[i].kursNachBez + '</span>' +
			'</a>' +
		'</li>';
		
	}
					
	// gespeicherte Berechnungen in Dashboard Listview ausgeben	
	$('#archivKurse').append(output).listview('refresh');

	// Wenn keine Daten vorhanden
	if(recKurse === 0) { $('#message').append('Keine Daten vorhanden!'); } 
}

//
// _________ Gespeicherten Wechselkurse anzeigen und editieren
//
function editKurseDetail(i) {

	// Record# für weitere Funktionen auf Seiten div hinterlegen
	$("#KurseDetailPage").attr("rec", i);
			
	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KurseDetailPage", { 
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});

	// Bei den Key-Feldern für MD5-ID keine Änderungsmöglichkeit
	$('#kursVon').textinput({ disabled: true });
	$('#kursNach').textinput({ disabled: true });
					
	// Setzen der Inputfelder aus Daten der Datenbanktabelle "ktoPersonen"

	// Inputfelder aus Datenbank ersetzen
	$("#kursVon").val(recKurse[i].kursVon);
	$("#kursVonBez").val(recKurse[i].kursVonBez);
	$("#kursNach").val(recKurse[i].kursNach);
	$("#kursNachBez").val(recKurse[i].kursNachBez);
	$("#kursWert").val(recKurse[i].kursWert);

	// Navbar anpassen	
	$('.navbarFooter_modify').show();
	$('.navbarFooter_add').hide();
		
}

//
// _________ Gespeicherte Wechselkurse aus Datenbank löschen
//
function deleteKurse(i) {

	$('#delItem').text(recKurse[i].kursVon + recKurse[i].kursNach + ' = ' + recKurse[i].kursWert);	// Itembeschreibung in Popup eintragen
	$("#delConfirm").popup("open");								// Confirm Popup open
	$('#delItemBtn').bind('click', function() {	
					
		// Löschen Personen aus Tabelle: "ktoPersonen" 
		viaJournalDB_085.deleteRows("Wechselkurse", function(row) {
			if(row.code == recKurse[i].code) { return true; }
			else { return false; }
		});
		viaJournalDB_085.commit(); 								// Commit the deletions to localStorage
		
		$("#delConfirm").popup("close");							// Confirm Popup close

		window.location.href='./wechselkurse.html';			// Personen Seite aufrufen und damit page refresh		
		
	});

}

//
// _________ Wechselkurse in Datenbank speichern und/oder updaten
//
function saveKurse(i) {

	// _______ Validierung
	//
	// ID's of all required fields in Array
	var required = ["kursVonBez", "kursVon", "kursNachBez", "kursNach", "kursWert"];
	// Validate required fields		
	for(var j=0 in required) {
		var input = $('#'+required[j]);
		if(!input.val() || input.val() == "") {
			$('.popValidation').html("Es müssen alle Felder ausgefüllt werden. Die mit einem Stern<sup>*</sup> gekennzeichneten Felder können nachträglich nicht geändert werden!")
			$('#validation').popup("open");							// Confirm Validierung von zwingenden Eingabefeldern
			return;
		}
	}

	// Auf doppelten Eintrag prüfen
	// Beim Anlegen von neuen Kursen wird "i" nicht übertragen !!!  
	if(i && recKurse[i].code == MD5($("#kursVon").val() + ',' + $("#kursNach").val())) {
	
		$('#doubleCheck').popup("open");							// Confirm DoubleCheck des Entrags
		$('#doubleCheckBtn').bind('click', function() {	

			// Sind Wechselkurse in Datenbank, dann update oder neu anlegen eines neuen Datensatzes
			viaJournalDB_085.insertOrUpdate("Wechselkurse", { 
				code: MD5($("#kursVon").val() + ',' + $("#kursNach").val()) 	// 'kursVon,kursNach'
				}, {
				code: MD5($("#kursVon").val() + ',' + $("#kursNach").val()),
				datum: $.getActualiCal('UTC'),							// Änderungsdatum
				kursVon: $("#kursVon").val(),								// Kurs von
				kursVonBez: $("#kursVonBez").val(),					// Kursbezeichnung
				kursNach: $("#kursNach").val(),							// Kurs nach
				kursNachBez: $("#kursNachBez").val(),				// Kursbezeichnung
				kursWert: convertDot($("#kursWert").val())	// Kurswert
			});
			viaJournalDB_085.commit(); 									// Commit the update to localStorage
			
			$("#doubleCheck").popup("close");							// Confirm DoubleCheck close
			window.location.href='./wechselkurse.html';		// Wechselkurse Seite aufrufen und damit page refresh
							
		});
				
	}	else {

		$('#popupSuccess').popup("open");							// Confirm popupSuccess open
		
		// Sind Wechselkurse in Datenbank, dann update oder neu anlegen eines neuen Datensatzes
		viaJournalDB_085.insertOrUpdate("Wechselkurse", { 
			code: MD5($("#kursVon").val() + ',' + $("#kursNach").val()) 	// 'kursVon,kursNach'
			}, {
			code: MD5($("#kursVon").val() + ',' + $("#kursNach").val()),
			datum: $.getActualiCal('UTC'),							// Änderungsdatum
			kursVon: $("#kursVon").val(),								// Kurs von
			kursVonBez: $("#kursVonBez").val(),					// Kursbezeichnung
			kursNach: $("#kursNach").val(),							// Kurs nach
			kursNachBez: $("#kursNachBez").val(),				// Kursbezeichnung
			kursWert: convertDot($("#kursWert").val())	// Kurswert
		});
		viaJournalDB_085.commit(); 									// Commit the update to localStorage

		// Transaktionen Seite nach Wartezeit von 2000 Millisekunden aufrufen und damit page refresh
		setTimeout(function(){ window.location.href='./wechselkurse.html'; }, 2000);
	}		
}

//
// _________ Neues Sachkonto in Datenbank aufnehmen
//
function addKurse() {

	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#KurseDetailPage", {
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});
	
	// Bei den Key-Feldern für MD5-ID "Diabled" aufheben
	$('#kursVon').textinput({ disabled: false });
	$('#kursNach').textinput({ disabled: false });
	
	// Inputfelder nullen
	$("#kursVon").val(null);
	$("#kursVonBez").val(null);		
	$("#kursNach").val(null);
	$("#kursNachBez").val(null);
	$("#kursWert").val(null);		
	
	$('KurseDetail').textinput("refresh" );
	
	// Navbar anpassen	
	$('.navbarFooter_modify').hide();
	$('.navbarFooter_add').show();	
	
}

//
// _________ Gespeicherte Transaktionen anzeigen
//
function showTrans() { 

	// URL auslesen, um mit Journal-Code weiterarbeiten zu können
	var urlPara = $(location).attr('href').split("?");
								
	// Alle gespeicherten Transaktionen auslesen
	//
	recTrans = viaJournalDB_085.query("Transaktionen");
	
	// Alle gespeicherten Konten auslesen
	//
	var recTransKto = viaJournalDB_085.query("Konten");
				
	var output = '',
		vonKtoName,
		vonKtoVorName,
		vonKtoNachName,
		nachKtoName;
		
	for(var i=0 in recTrans) {									// das gesamte gespeicherte Array durchlaufen
	
		if(recTrans[i].transJournal == urlPara[1]) {			// Nur Buchungen zeigen, die zum entsprechenden Journal gehören

			// Message Text ggf. ausblenden wenn mal gesetzt wurde!
			$('#message').hide();
				
			// Konten durchlaufen und ktoName (Sachen/Fonds) und ktoVor und Nachname (Personen) suchen
			for(var j=0 in recTransKto) {	
				if(recTransKto[j].code == recTrans[i].transVon) {
					vonKtoName = (recTransKto[j].ktoName) ? recTransKto[j].ktoName : '';
					vonKtoVorName = (recTransKto[j].ktoVorName) ? recTransKto[j].ktoVorName : '';
					vonKtoNachName = (recTransKto[j].ktoNachName) ? recTransKto[j].ktoNachName : '';
				} else if(recTransKto[j].code == recTrans[i].transNach) {
					nachKtoName = (recTransKto[j].ktoName) ? recTransKto[j].ktoName : '';
					nachKtoVorName = (recTransKto[j].ktoVorName) ? recTransKto[j].ktoVorName : '';
					nachKtoNachName = (recTransKto[j].ktoNachName) ? recTransKto[j].ktoNachName : '';
				}
			}

			// Laufvariable "i" wird als Attribut: "rec", transCode als "code" und transJournal als "journal" übergeben
			// Listeintrag mit Infos zu Buchungsname und wer, was wohin gebucht hat
			output += '<li>' +
//				'<a href="#" class="linkTransDetail" rec="' + i + '" + code="' + recTrans[i].code + '" + journal="' + recTrans[i].transJournal + '">' +
				'<a href="#" class="linkTransDetail" rec="' + i + '" >' +
					recTrans[i].transName +
					'</br><span style="font-size:.8em">' + vonKtoName + vonKtoVorName + ' ' + vonKtoNachName + ' nach: ' + nachKtoName + nachKtoVorName + ' ' + nachKtoNachName + '</span>' +
					'</br><span style="font-size:.8em">' + recTrans[i].transDatum + ', ' + recTrans[i].transBetrag + ' ' + recTrans[i].transCurrency + '</span>' +
				'</a>' +
			'</li>';
			
		} else {
			
			// Anzeigen, dass bisher keine Buchungen für das Journal eingetragen wurden
			$('#message').html('<p><b>Bisher keine Buchungen eingetragen!</b></p><p>Wählen Sie bitte in der Fusszeile den Button: < + NEU> um eine neue Buchungen vorzunehmen.</p>');

		}
			
	}
				
	// gespeicherte Berechnungen in Dashboard Listview ausgeben	
	$('#archivTrans').append(output).listview('refresh');

	// Wenn über alle Journale hinweg keine Buchungen/Transaktionen eingetragen sind!
	if(recTrans === 0) { $('#message').append('<p><b>Bisher keine Buchungen eingetragen!</b></p><p>Wählen Sie bitte in der Fusszeile den Button: < + NEU> um ein neues Journal zu beginnen.</p>'); } 
}

//
// _________ Gespeicherten Transaktionen anzeigen und editieren
//
function editTransDetail(i) {

	// Lokale Variablen
	var refCurrency = '',
		arrPersonen = [],
		arrKonten = [];

	// ACHTUNG: Die Variable "i" darf in dieser Funktion keine weitere Verwendung finden, 
	// da ansonsten die "recTrans[i]" - Variablen nicht verwendet werden können!!! 

	// URL auslesen, um mit "Journal-Code" weiterarbeiten zu können
	var urlPara = $(location).attr('href').split("?");

	// Record# für weitere Funktionen auf Seiten div hinterlegen
	$("#TransDetailPage").attr("rec", i);
			
	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#TransDetailPage", { 
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});	

	// Alle gespeicherten Journale auslesen und in den Selectfeldern darstellen
	//
	var recJournal = viaJournalDB_085.query("Journal");
	for(var j=0 in recJournal) {
		if(recJournal[j].code == urlPara[1]) {
			$("#transJournalEdit").html('Journal: ' + recJournal[j].journalName + '</br>Zeitraum: ' + recJournal[j].journalDatumVon + ' - ' + recJournal[j].journalDatumBis);		
			// Referenzwährung auslesen
			refCurrency = recJournal[j].journalCurrency;
			// Teilnehmende Personen auslesen
			arrPersonen = recJournal[j].journalPersonen;
			// auf zu buchende Konten auslesen
			arrKonten = recJournal[j].journalKonten;
		}
	}
	
	// Alle gespeicherten Journale auslesen und alternativ zu Select in Input darstellen
	//
//	var recJournal = viaJournalDB_085.query("Journal");
//	for(var j=0 in recJournal) {
//		if(recJournal[j].code == recTrans[i].transJournal) {	
//			// Inputfelder als Ersatz für Select aus Datenbank ersetzen
//			$("#transJournalEdit").val(recJournal[j].journalName + ' (' + recJournal[j].journalDatumVon + ' - ' + recJournal[j].journalDatumBis + ')');
//		} 
//	}
	// Bei den Key-Feldern für MD5-ID keine Änderungsmöglichkeit
//	$('#transJournalEdit').textinput({ disabled: true });
	// Trick: bei Edit wird Input- und bei Add wird Select geöffnet
	// Workaround, da hin- und herschalten von Select Probleme in der Darstellung macht!
//	$("#showTransEdit").show();
//	$("#showTransAdd").hide();
	
	// Alle gespeicherten Währungen auslesen und im Selectfeld darstellen
	//
	var recKurse = viaJournalDB_085.query("Wechselkurse");
	var kurseVonArray = [],
		kurseNachArray = [],
		kurseArray = [];
	// Währungen aus Datenbank in Arrays zusammenbauen
	for(var j=0 in recKurse) {
		// Währung nur auflisten, wenn Referenzwährung entspricht!
		if(recKurse[j].kursVon == refCurrency) {
			kurseVonArray.push(recKurse[j].kursVon);
			kurseNachArray.push(recKurse[j].kursNach);
		}
	}
	// Arrays verbinden und doppelte Einträge löschen
	kurseArray = union(kurseVonArray, kurseNachArray);		
	// Array durchlaufen und in select Input-Feld einfügen
	$("#transCurrency").empty();									// Alle Select Optionen löschen 
	$.each(kurseArray, function(key, value) {
		$("<option/>").val(value).text(value).appendTo("#transCurrency");
	});
	$("#transCurrency").selectmenu('refresh');		// Select Refresh	
	
	
	// Alle gespeicherten Konten Personen und Gemeinschaftskonten auslesen und in den Selectfeldern darstellen
	//
	var recTransKto = viaJournalDB_085.query("Konten");
	$("#transVonPersonen, #transNachPersonen").empty();		// Alle Select Optionen löschen 
	$("#transVonFonds, #transNachFonds").empty();
	$("#transNachSachen").empty();
	for(var j=0 in recTransKto) {
		// Transaktion von Konto
		if(recTransKto[j].ktoIdent == 'Personen') {
			// Nur wenn in teilnehmenden Personen aufgeführt, dann darstellen			
			$.each(arrPersonen, function(key, value) {
				if(value == recTransKto[j].code) {
					$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoVorName + ' ' + recTransKto[j].ktoNachName).appendTo("#transVonPersonen, #transNachPersonen");
				}
			});		
		} else if(recTransKto[j].ktoIdent == 'Sachen') {
			// Nur wenn in zu buchende Konten aufgeführt, dann darstellen
			$.each(arrKonten, function(key, value) {
				if(value == recTransKto[j].code) {
					$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoName).prependTo("#transNachSachen");
				}
			});
		} else if(recTransKto[j].ktoIdent == 'Fonds') {
			// Nur wenn in zu buchende Konten aufgeführt, dann darstellen
			$.each(arrKonten, function(key, value) {
				if(value == recTransKto[j].code) {
					$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoName).appendTo("#transVonFonds, #transNachFonds");
				}
			});	
		}
	}
	$("#transVon, #transNach").selectmenu('refresh');			// Select Menüs müssen refreshed werden	
	
	// Inputfelder aus Datenbank ersetzen
	$("#transCode").val(recTrans[i].code);			// Hidden Inputfeld, dient nur der korrekten Speicherung !!!
	$("#transName").val(recTrans[i].transName);
	$("#transDatum").val(recTrans[i].transDatum);
	$("#transOrt").val(recTrans[i].transOrt);	
	$("#transBetrag").val(recTrans[i].transBetrag);
	$("#transBIC").val(recTrans[i].transBIC);
	$("#transIBAN").val(recTrans[i].transIBAN);

	// Select Option Felder mit Daten aus Datenbank darstellen	
	$("#transCurrency").val(recTrans[i].transCurrency).selectmenu('refresh');
	$("#transVon").val(recTrans[i].transVon).selectmenu('refresh');
	$("#transNach").val(recTrans[i].transNach).selectmenu('refresh');

	// Navbar anpassen	
	$('.navbarFooter_modify').show();
	$('.navbarFooter_add').hide();
		
}

//
// _________ Gespeicherte Transaktionen aus Datenbank löschen
//
function deleteTrans(i) {

	$('#delItem').text(recTrans[i].transName);		// Itembeschreibung in Popup eintragen
	$("#delConfirm").popup("open");								// Confirm Popup open
	$('#delItemBtn').bind('click', function() {	
					
		// Löschen Transaktionen aus Tabelle: "Transaktionen" 
		viaJournalDB_085.deleteRows("Transaktionen", function(row) {
			if(row.code == recTrans[i].code) { return true; }
			else { return false; }
		});
		viaJournalDB_085.commit(); 								// Commit the deletions to localStorage
		
		$("#delConfirm").popup("close");							// Confirm Popup close

		window.location.href='./transaktionen.html?' + recTrans[i].transJournal;		// Transaktions Seite aufrufen mit Übergabe des JournalCodes

	});

}		

//
// _________ Transaktionen in Datenbank speichern und/oder updaten
//
function saveTrans(i) {

	// _______ Validierung
	//
	// ID's of all required fields in Array
	var required = ["transName", "transDatum", "transVon", "transNach", "transBetrag", "transCurrency"];
	// Validate required fields		
	for(var j=0 in required) {
		var input = $('#'+required[j]);
		if(!input.val() || input.val() == "") {
			$('.popValidation').html("Die mit einem Stern<sup>*</sup> gekennzeichneten Felder müssen ausgefüllt werden!")
			$('#validation').popup("open");							// Confirm Validierung von zwingenden Eingabefeldern
			return;
		}
	}

	// URL auslesen, um mit Journal-Code weiterarbeiten zu können
	var urlPara = $(location).attr('href').split("?");
	var urlJournal = urlPara[1].split("#");

	// Workaround, da Code aus aktuellem Datum genommen wird und sich mit der Zeit ändert!
	var storeDatum = $.getActualiCal('UTC');
	var storeCode = ($("#transCode").val()) ? recTrans[i].code : MD5(storeDatum + ',' + urlJournal[0]);

	// Auf doppelten Eintrag prüfen
	// Beim Anlegen von neuen Kursen wird "i" nicht übertragen !!!  
	if(i && recTrans[i].code == storeCode) {
	
		$('#doubleCheck').popup("open");							// Confirm DoubleCheck des Entrags
		$('#doubleCheckBtn').bind('click', function() {	
		
			// Ist ein Journal in Datenbank, dann update oder neu anlegen eines neuen Datensatzes		
			viaJournalDB_085.insertOrUpdate("Transaktionen", { 
				code: storeCode 
				}, {
				code: storeCode,													// Setzt sich u.a. aus dem Anlagedatum zusammen
				datum: storeDatum,												// Änderungsdatum
				transJournal: recTrans[i].transJournal,		// Code des zugehörenden Journal
				transDatum: $("#transDatum").val(),					// Datum der Transaktion
				transName: $("#transName").val(),						// Name der Transaktion
				transOrt: $("#transOrt").val(),							// Ort der Transaktion
				transBetrag: number_format(convertDot($("#transBetrag").val())),	// Höhe/Wert der Transaktion
				transCurrency: $("#transCurrency").val(),		// Währung
				transVon: $("#transVon").val(),							// Person oder Gemeinschaftskonto von WO gezahlt wird
				transNach: $("#transNach").val(),						// Gemeinschaft- oder Sachkonto WORAUF gezahlt wird
				ktoGPS:	null,															// GPS-Position noch nicht implementiert
				ktoPicture: null														// Photo von der Transaktion noch nicht implementiert
			});
			viaJournalDB_085.commit(); 									// Commit the update to localStorage
	
			$("#doubleCheck").popup("close");							// Confirm DoubleCheck close
			
			window.location.href='./transaktionen.html?' + recTrans[i].transJournal;		// Transaktions Seite aufrufen mit Übergabe des JournalCodes

		});
				
	}	else {
	
		// Ist ein Journal in Datenbank, dann update oder neu anlegen eines neuen Datensatzes		
		viaJournalDB_085.insertOrUpdate("Transaktionen", { 
			code: storeCode 
			}, {
			code: storeCode,
			datum: storeDatum,												// Änderungsdatum
			transJournal: urlJournal[0],								// Code des zugehörenden Journal aus der URL
			transDatum: $("#transDatum").val(),					// Datum der Transaktion
			transName: $("#transName").val(),						// Name der Transaktion
			transOrt: $("#transOrt").val(),							// Ort der Transaktion
			transBetrag: number_format(convertDot($("#transBetrag").val())),	// Höhe/Wert der Transaktion
			transCurrency: $("#transCurrency").val(),		// Währung
			transVon: $("#transVon").val(),							// Person oder Gemeinschaftskonto von WO gezahlt wird
			transNach: $("#transNach").val(),						// Gemeinschaft- oder Sachkonto WORAUF gezahlt wird
			ktoGPS:	null,															// GPS-Position noch nicht implementiert
			ktoPicture: null														// Photo von der Transaktion noch nicht implementiert
		});
		viaJournalDB_085.commit(); 									// Commit the update to localStorage

		setTimeout(function(){												// Wartezeit von 2000 Millisekunden 	
			$("#popupSuccess").popup("open");						// Success-Nachricht Popup öffnen
		}, 2000);	
		$("#popupSuccess").popup("close");							// Success-Nachricht Popup öffnen
		
		window.location.href='./transaktionen.html?' + urlJournal[0];		// Transaktions Seite aufrufen mit Übergabe des JournalCodes

	}		
}

//
// _________ Neue Transaktionen/Buchungen in Datenbank aufnehmen
//
function addTrans() {

	// Lokale Variablen
	var refCurrency = '',
		arrPersonen = [],
		arrKonten = [];
	
	// URL auslesen, um mit Journal-Code weiterarbeiten zu können
	var urlPara = $(location).attr('href').split("?");

	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#TransDetailPage", {
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});
	
	// Alle gespeicherten Journale auslesen und in den Selectfeldern darstellen
	//
	var recJournal = viaJournalDB_085.query("Journal");
	for(var j=0 in recJournal) {
		if(recJournal[j].code == urlPara[1]) {
			$("#transJournalEdit").html('Journal: ' + recJournal[j].journalName + '</br>Zeitraum: ' + recJournal[j].journalDatumVon + ' - ' + recJournal[j].journalDatumBis);		
			// Referenzwährung auslesen
			refCurrency = recJournal[j].journalCurrency;
			// Teilnehmende Personen auslesen
			arrPersonen = recJournal[j].journalPersonen;
			// auf zu buchende Konten auslesen
			arrKonten = recJournal[j].journalKonten;
		}
	}

	// Alle gespeicherten Währungen auslesen und im Selectfeld darstellen
	//
	var recKurse = viaJournalDB_085.query("Wechselkurse");
	var kurseVonArray = [],
		kurseNachArray = [],
		kurseArray = [];
	// Währungen aus Datenbank in Arrays zusammenbauen
	for(var j=0 in recKurse) {	
		// Währung nur auflisten, wenn Referenzwährung entspricht!
		if(recKurse[j].kursVon == refCurrency) {
			kurseVonArray.push(recKurse[j].kursVon);
			kurseNachArray.push(recKurse[j].kursNach);
		}					
	}
	// Arrays verbinden und doppelte Einträge löschen
	kurseArray = union(kurseVonArray, kurseNachArray);		
	// Array durchlaufen und in select Input-Feld einfügen
	$("#transCurrency").empty();									// Alle Select Optionen löschen 
	$.each(kurseArray, function(key, value) {
		$("<option/>").val(value).text(value).appendTo("#transCurrency");
	});
	$("#transCurrency").selectmenu('refresh');		// Select Refresh	
	
	
	// Alle gespeicherten Konten Personen und Gemeinschaftskonten auslesen und in den Selectfeldern darstellen
	//
	var recTransKto = viaJournalDB_085.query("Konten");
	$("#transVonPersonen, #transNachPersonen").empty();		// Alle Select Optionen löschen 
	$("#transVonFonds, #transNachFonds").empty();
	$("#transNachSachen").empty();	
	for(var j=0 in recTransKto) {
		// Transaktion von Konto
		if(recTransKto[j].ktoIdent == 'Personen') {
			// Nur wenn in teilnehmenden Personen aufgeführt, dann darstellen			
			$.each(arrPersonen, function(key, value) {
				if(value == recTransKto[j].code) {
					$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoVorName + ' ' + recTransKto[j].ktoNachName).appendTo("#transVonPersonen, #transNachPersonen");
				}
			});
		} else if(recTransKto[j].ktoIdent == 'Sachen') {
			// Nur wenn in zu buchende Konten aufgeführt, dann darstellen			
			$.each(arrKonten, function(key, value) {
				if(value == recTransKto[j].code) {
					$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoName).prependTo("#transNachSachen");
				}
			});					
		} else if(recTransKto[j].ktoIdent == 'Fonds') {
			// Nur wenn in zu buchende Konten aufgeführt, dann darstellen			
			$.each(arrKonten, function(key, value) {
				if(value == recTransKto[j].code) {
					$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoName).appendTo("#transVonFonds, #transNachFonds");		
				}
			});	
		}
	}
	
	// Select Menüs müssen refreshed werden
	$("#transVon, #transNach").selectmenu('refresh');
	
	// Inputfelder nullen
	$("#transCode").val(null);		// kleiner Workaround
	$("#transName").val(null);
	$("#transDatum").val(null);
	$("#transOrt").val(null);
	$("#transBetrag").val(null);	
	$("#transGPS").val(null);
	$("#transPicture").val(null);
	
	// Selectfelder nullen
	$("#transVon").val(null);
	$("#transNach").val(null);
	
	// Navbar anpassen	
	$('.navbarFooter_modify').hide();
	$('.navbarFooter_add').show();	
	
	return;
	
}

//
// _________ Gespeicherte Journale anzeigen
//
function showJournal() { 
	
	// Alle gespeicherten Journale auslesen
	//
	recJournal = viaJournalDB_085.query("Journal");
				
	var output = '';
		
	for(var i=0 in recJournal) {			// das gesamte gespeicherte Array durchlaufen

		// Laufvariable "i" wird als Attribut: "rec" übergeben
		// Listeintrag mit Infos zu Buchungsname und wer, was wohin gebucht hat
		output += '<li>' +
			'<a href="#" class="linkJournalDetail" rec="' + i + '">' +
				recJournal[i].journalName +
				'</br><span style="font-size:.8em">' + recJournal[i].journalBemerkung + '</span>' +
				'</br><span style="font-size:.8em">' + recJournal[i].journalDatumVon + ' bis: ' + recJournal[i].journalDatumBis + '</span>' +
			'</a>' +
		'</li>';
		
	}
				
	// gespeicherte Berechnungen in Dashboard Listview ausgeben	
	$('#archivJournal').append(output).listview('refresh');

	// Wenn keine Daten vorhanden
	if(recJournal === 0) { $('#message').append('<p><b>Keine Journale eingetragen!</b></p><p>Wählen Sie bitte in der Fusszeile den Button: < + NEU> um ein neues Journal zu beginnen.</p>'); } 

	// Workaround um aus Buchungen/Report wieder in das entsprechende Detail des Journals zu kommen!
	// URL auslesen, um mit Journal-Code weiterarbeiten zu können
	var urlPara = $(location).attr('href').split("?");	// Inhalt ist die rec#
	if(urlPara[1]) { editJournalDetail(urlPara[1]); }	// Wenn rec# übergeben wurde, dann Sprung in die Detailpage
}

//
// _________ Gespeicherten Wechselkurse anzeigen und editieren
//
function editJournalDetail(i) {
	
	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#JournalDetailPage", { 
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg: false,
		reload: false 
	});
	
	// Record# für weitere Funktionen auf Seiten div hinterlegen
	$("#JournalDetailPage").attr("rec", i);
	
	
	// Alle gespeicherten Konten Personen auslesen und im Selectfeld als Journal-Führer darstellen
	//
	var recTransKto = viaJournalDB_085.query("Konten");
	$("#journalLeader").empty();		// Alle Select Optionen löschen 
	for(var j=0 in recTransKto) {
		// Transaktion von Konto
		if(recTransKto[j].ktoIdent == 'Personen') {
			$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoVorName + ' ' + recTransKto[j].ktoNachName).appendTo("#journalLeader");
		}
	}
	$("#journalLeader").selectmenu('refresh');			// Select Menüs müssen refreshed werden	

	// Alle gespeicherten Währungen auslesen und im Selectfeld darstellen
	//
	var recKurse = viaJournalDB_085.query("Wechselkurse");
	var kurseVonArray = [],
		kurseNachArray = [],
		kurseArray = [];
	// Währungen aus Datenbank in Arrays zusammenbauen
	for(var j=0 in recKurse) {			
		kurseVonArray.push(recKurse[j].kursVon);	// Es werden nur Wärungen genommen die Von entsprechen
//		kurseNachArray.push(recKurse[j].kursNach);	
	}
	// Arrays verbinden und doppelte Einträge löschen
	kurseArray = union(kurseVonArray, kurseNachArray);		
	// Array durchlaufen und in select Input-Feld einfügen
	$("#journalCurrency").empty();									// Alle Optionen löschen 
	$.each(kurseArray, function(key, value) {
		$("<option/>").val(value).text(value).appendTo("#journalCurrency");
	});
	$("#journalCurrency").selectmenu('refresh', true);		// Select Refresh	


	// Teilnehmende Personen aus Array auslesen und darstellen
	//
	$("#journalPersonen, #journalKonten, #journalLeader").empty();							// Alle Optionen löschen 
	$("<option/>").text('Wähle Teilnehmer...').appendTo("#journalPersonen");
	$("<option/>").text('Wähle Konten...').appendTo("#journalKonten");
	
	for(var j=0 in recTransKto) {

		// Transaktion von Konto: Personen
		if(recTransKto[j].ktoIdent == 'Personen') {
		
			var marked = true;
			$.each(recJournal[i].journalPersonen, function(key, value) {
				if(recTransKto[j].code == value) {	// Auswahl markieren
					$("#journalPersonen").append('<option selected="selected" value="' + recTransKto[j].code + '">' + recTransKto[j].ktoVorName + ' ' + recTransKto[j].ktoNachName + '</option>');
					marked = false;
				}
			});
			
			if(marked) { 
				$("#journalPersonen").append('<option value="' + recTransKto[j].code + '">' + recTransKto[j].ktoVorName + ' ' + recTransKto[j].ktoNachName + '</option>');
			}

			// journalLeader 
			$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoVorName + ' ' + recTransKto[j].ktoNachName).appendTo("#journalLeader");
		}
		
		// Transaktion von Konto: Fonds und Sachen
		if(recTransKto[j].ktoIdent == 'Sachen' || recTransKto[j].ktoIdent == 'Fonds') {
		
			var marked = true;
			$.each(recJournal[i].journalKonten, function(key, value) {		
				if(recTransKto[j].code == value) {	// Auswahl markieren
					$("#journalKonten").append('<option selected="selected" value="' + recTransKto[j].code + '">' + recTransKto[j].ktoName + '</option>');
					marked = false;
				}
			});						

			if(marked) { 
				$("#journalKonten").append('<option value="' + recTransKto[j].code + '">' + recTransKto[j].ktoName + '</option>');
			}
					
		}

	}	
	$("#journalPersonen, #journalKonten, #journalLeader").selectmenu('refresh', true);		// Select Refresh	


	// Bei den Key-Feldern für MD5-ID keine Änderungsmöglichkeit
	$('#journalName').textinput({ disabled: true });
	$('#journalDatumVon').textinput({ disabled: true });
	$('#journalDatumBis').textinput({ disabled: true });
					
	// Setzen der Inputfelder aus Daten der Datenbanktabelle "ktoPersonen"

	// Inputfelder aus Datenbank ersetzen
	$("#journalName").val(recJournal[i].journalName);
	$("#journalBemerkung").val(recJournal[i].journalBemerkung);
	$("#journalLeader").val(recJournal[i].journalLeader);
	$("#journalDatumVon").val(recJournal[i].journalDatumVon);
	$("#journalDatumBis").val(recJournal[i].journalDatumBis);
	
	// Select Option Felder mit Daten aus Datenbank darstellen	
	$("#journalCurrency").val(recJournal[i].journalCurrency).selectmenu('refresh',true);
	$("#journalLeader").val(recJournal[i].journalLeader).selectmenu('refresh', true);

	// Navbar anpassen	
	$('.navbarFooter_modify').show();
	$('.navbarFooter_add').hide();
		
}

//
// _________ Gespeicherte Journale aus Datenbank löschen
//
function deleteJournal(i) {

	$('#delItem').text(recJournal[i].journalName);		// Itembeschreibung in Popup eintragen
	$("#delConfirm").popup("open");										// Confirm Popup open
	$('#delItemBtn').bind('click', function() {	
					
		// Löscht das entsprechende Journal aus Tabelle: "Journal" 
		viaJournalDB_085.deleteRows("Journal", function(row) {
			if(row.code == recJournal[i].code) { return true; }
			else { return false; }
		});
		viaJournalDB_085.commit(); 								// Commit the deletions to localStorage
		
		// Löscht alle Transaktionen aus Tabelle: "Transaktionen" 
		viaJournalDB_085.deleteRows("Transaktionen", function(row) {
			if(row.transJournal == recJournal[i].code) { return true; }
			else { return false; }
		});
		viaJournalDB_085.commit(); 								// Commit the deletions to localStorage		
		
		$("#delConfirm").popup("close");							// Confirm Popup close

		window.location.href='./index.html';				// Journal/Index Seite aufrufen und damit page refresh		
		
	});

}		

//
// _________ Journal in Datenbank speichern und/oder updaten
//
function saveJournal(i) {

	// _______ Validierung
	//
	// ID's of all required fields in Array
	var required = ["journalName", "journalPersonen", "journalKonten", "journalDatumVon", "journalDatumBis"];
	// Validate required fields		
	for(var j=0 in required) {
		var input = $('#'+required[j]);
		if(!input.val() || input.val() == "") {
			$('.popValidation').html("Es müssen alle Felder ausgefüllt werden. Die mit einem Stern<sup>*</sup> gekennzeichneten Felder können nachträglich nicht geändert werden!")
			$('#validation').popup("open");							// Confirm Validierung von zwingenden Eingabefeldern
			return;
		}
	}
		
	var MD5code = MD5($("journalName").val() + ',' + $("#journalDatumVon").val() + ',' + $("#journalDatumBis").val()) || undefined;

	// Auf doppelten Eintrag prüfen
	// Beim Anlegen von neuen Kursen wird "i" nicht übertragen !!!  
	if(i && recJournal[i].code == MD5code) {
	
		$('#doubleCheck').popup("open");							// Confirm DoubleCheck des Entrags
		$('#doubleCheckBtn').bind('click', function() {	

			// Journal in Datenbank, dann update oder neu anlegen eines neuen Datensatzes
			viaJournalDB_085.insertOrUpdate("Journal", { 
				code: MD5code 
				}, {
				code: MD5code,
				datum: $.getActualiCal('UTC'),									// Änderungsdatum
				journalName: $("#journalName").val(),						// Name des Journals
				journalBemerkung: $("#journalBemerkung").val(),	// zusätzliche Bemerkung
				journalDatumVon: $("#journalDatumVon").val(),		// Zeitraum des Journals
				journalDatumBis: $("#journalDatumBis").val(),
				journalLeader: $("#journalLeader").val(),		
				journalPersonen: $("#journalPersonen").val(),		// Array aller beteiligten Personen			
				journalTransaktionen: [],											// Array aller Transaktionen die sich auf das Journal beziehen
				journalKonten: $("#journalKonten").val(),				// benutzte Sach- und Fonds Konten
				journalKurse: [],
				journalCurrency: $("#journalCurrency").val(),		// Währung für Abrechnung
				journalPicture: null														// Photo des Journals
			});
			viaJournalDB_085.commit(); 									// Commit the update to localStorage
	
			$("#doubleCheck").popup("close");							// Confirm DoubleCheck close
			window.location.href='./index.html';					// Jurnal Seite aufrufen und damit page refresh
							
		});
				
	}	else {

		$('#popupSuccess').popup("open");									// Confirm popupSuccess open
		
		viaJournalDB_085.insertOrUpdate("Journal", { 
			code: MD5code 
			}, {
			code: MD5code,
			datum: $.getActualiCal('UTC'),									// Änderungsdatum
			journalName: $("#journalName").val(),						// Name des Journals
			journalBemerkung: $("#journalBemerkung").val(),	// zusätzliche Bemerkung
			journalDatumVon: $("#journalDatumVon").val(),		// Zeitraum des Journals
			journalDatumBis: $("#journalDatumBis").val(),
			journalLeader: $("#journalLeader").val(),
			journalPersonen: $("#journalPersonen").val(),		// Array mit teilnehmenden Personen
			journalTransaktionen: [],											// Array aller Transaktionen die sich auf das Journal beziehen
			journalKonten: $("#journalKonten").val(),				// benutze Sach- und Fonds Konten
			journalKurse: [],
			journalCurrency: $("#journalCurrency").val(),		// Währung für Abrechnung
			journalPicture: null														// Photo des Journals
		});
		viaJournalDB_085.commit(); 											// Commit the update to localStorage

		// Transaktionen Seite nach Wartezeit von 2000 Millisekunden aufrufen und damit page refresh
		setTimeout(function(){ window.location.href='./index.html'; }, 2000);
		
	}		
}

//
// _________ Neue Transaktionen/Buchungen in Datenbank aufnehmen
//
function addJournal() {

	// Wechseln der Seite um Änderungen zu ermöglichen - Neu ab jqm 1.4
	$("body").pagecontainer("change", "#JournalDetailPage", {
		allowSamePageTransition : true, 
		transition: "fade",
		showLoadMsg : false,
		reloadPage : false 
	});
	
	
	// Alle gespeicherten Währungen auslesen und im Selectfeld darstellen
	//
	var recKurse = viaJournalDB_085.query("Wechselkurse");
	var kurseVonArray = [],
		kurseNachArray = [],
		kurseArray = [];
	// Währungen aus Datenbank in Arrays zusammenbauen
	for(var j=0 in recKurse) {			
		kurseVonArray.push(recKurse[j].kursVon);		// Es werden nur Währungen von genommen
//		kurseNachArray.push(recKurse[j].kursNach);
	}
	// Arrays verbinden und doppelte Einträge löschen
	kurseArray = union(kurseVonArray, kurseNachArray);		
	// Array durchlaufen und in select Input-Feld einfügen
	$("#journalCurrency").empty();									// Alle Optionen löschen
	$.each(kurseArray, function(key, value) {
		$("<option/>").val(value).text(value).appendTo("#journalCurrency");
	});
	$("#journalCurrency").selectmenu('refresh', true);		// Select Refresh	


	// Alle gespeicherten Konten Personen auslesen und im Selectfeld als Journal-Führer darstellen
	//
	var recTransKto = viaJournalDB_085.query("Konten");
	$("#journalLeader, #journalPersonen, #journalKonten").empty();			// Alle Select Optionen löschen

	// Multiselect Überschrift bei teilnehmenden Personen, Sachen und Fonds 
	$("<option/>").val(null).text('Wähle Teilnehmer...').appendTo("#journalPersonen");
	$("<option/>").val(null).text('Wähle Konten...').appendTo("#journalKonten");
	
	for(var j=0 in recTransKto) {

		// Transaktion von Konto: Personen
		if(recTransKto[j].ktoIdent == 'Personen') {
			$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoVorName + ' ' + recTransKto[j].ktoNachName).appendTo("#journalLeader, #journalPersonen");
		}

		// Transaktion von Konto: Sachen und Fonds
		if(recTransKto[j].ktoIdent == 'Sachen' || recTransKto[j].ktoIdent == 'Fonds') {
			$("<option/>").val(recTransKto[j].code).text(recTransKto[j].ktoName).appendTo("#journalKonten");
		}
				
	}
	// Select Auswahl für Journalleader
	$("#journalLeader, #journalPersonen, #journalKonten").selectmenu('refresh', true);																				// Select Menüs müssen refreshed werden	
	$("#journalLeader option:first").prop('selected','selected').selectmenu('refresh', true);		// Die erste Option selektieren, falls keine andere angewählt wird


	// Bei den Key-Feldern für MD5-ID Änderungsmöglichkeit ggf. durch "edit" wieder freigeben
	$('#journalName').textinput({ disabled: false });
	$('#journalDatumVon').textinput({ disabled: false });
	$('#journalDatumBis').textinput({ disabled: false });
	
	// Inputfelder nullen
	$("#journalName").val(null);
	$("#journalBemerkung").val(null);
	$("#journalDatumVon").val(null);
	$("#journalDatumBis").val(null);
	$("#journalLeader").val(null);
	$("#journalPersonen").val(null);			// wird als Array übergeben
	$("#journalKonten").val(null);				// wird als Array übergeben
	$("#journalTransaktionen").val(null);
	$("#journalKonten").val('[]');	
	$("#journalKurse").val('[]');			
	$("#journalPicture").val(null);
	
	$('#JournalDetail').textinput("refresh" );
	
	// Navbar anpassen	
	$('.navbarFooter_modify').hide();
	$('.navbarFooter_add').show();	
	
}

//
// _________ Reports zusammenstellen
//
function showReports() { 

	// Variablen
	var recTransArray = [],
		gesTransArray = [],
		gesBetrag = 0.00,
		gesPersonen = 0,
		exchangeBetrag = 0.00,
		exVonBetrag = 0.00,
		exNachBetrag = 0.00,
		fondsGesBetrag = 0.00,
		offZahlung = 0.00,
		offZahlungKasse = 0.00,
		offZahlungStr = '',
		outBetrag = '',
		outKonten = '', 
		transVonName = '',
		transVonIdent = '',
		transNachName = '',
		transNachIdent = '',
		anweisungStr = '',
		journalLeader = '',
		minusPersonen = '',
		zahlungenArr = [],
		LZ = '  - ',
		LZ4 = LZ+LZ,
		LZ10 = '  -------------- ';

	// URL auslesen, um mit Journal-Code weiterarbeiten zu können
	// urlPara definiert in "reports.html"
	urlPara = $(location).attr('href').split("?");


	// _________ Report Header	
	// Alle gespeicherten Journale auslesen und alternativ zu Select in Input darstellen
	//
	var recJournal = viaJournalDB_085.query("Journal");
	for(var i=0 in recJournal) {
		if(recJournal[i].code == urlPara[1]) {	
		
			// Verwalter des Journals - MD5 Code
			journalLeader = recJournal[i].journalLeader;
			
			// Name des Journals in globale Variable für Email (def. in "reports.html")
			journalName = recJournal[i].journalName;

			// Referenzwährung
			refCurrency = recJournal[i].journalCurrency;
			
			// Anzahl Teilnehmer
			gesPersonen = recJournal[i].journalPersonen.length;

			var outHeader = recJournal[i].journalName + 
				'</br><span style="font-size:.8em">' + recJournal[i].journalBemerkung +
				'</br> Zeitraum: ' + recJournal[i].journalDatumVon + ' - ' + recJournal[i].journalDatumBis + 
				'</span>';
			
			var outHeader_mail = recJournal[i].journalBemerkung + '\n' +
				'Zeitraum: ' + recJournal[i].journalDatumVon + ' - ' + recJournal[i].journalDatumBis + '\n' +
				'----------------------\n';
			
			// Ausgabe in Header Abschnitt
			$("#reportHeader").html(outHeader);
			$("#mailReport").append(outHeader_mail);
		} 
	}
	
	// Wechselkurse in Array auslesen
	//
	var recKurse = viaJournalDB_085.query("Wechselkurse");
	var kurseArray = [];
	// Währungen aus Datenbank in Arrays zusammenbauen
	for(var j=0 in recKurse) {	// in 2D-Array verpacken: ("EUR", "HRK", "7.134")
		kurseArray[j] = [recKurse[j].kursVon, recKurse[j].kursNach, recKurse[j].kursWert];	
	}
	
	// Alle gespeicherten Konten Personen, Sach und Gemeinschaftskonten und Transaktionen in Array auslesen
	//
	var recKonten = viaJournalDB_085.query("Konten");

	// Alle gespeicherten Transaktionen auslesen
	// ... in sortierter Rehenfolge nach "gebucht von / transVon" in aufsteigender Reihenfolge
	var recTrans = viaJournalDB_085.queryAll("Transaktionen", { sort: [["transVon", "ASC"]] });
	
	for(var i=0 in recTrans) {
	
		// Nur zum Journal entsprechende Transaktionen auswählen	
		if(recTrans[i].transJournal == urlPara[1]) {	

			// Match von "transVon"-Code zu Vorname "ktoVorname" in "Konten"-Personen
			for(var j=0 in recKonten) {		
				if(recTrans[i].transVon == recKonten[j].code) { 
					transVonName = (recKonten[j].ktoVorName) ? recKonten[j].ktoVorName + ' ' + recKonten[j].ktoNachName : recKonten[j].ktoName;
					transVonIdent = recKonten[j].ktoIdent;

					// Email "To-Field" Array zusammenstellen					
					if(recKonten[j].ktoEmail) { transVonEmail.push(recKonten[j].ktoEmail); }		// Nur wenn Email vorhanden ist, in Array
					
				}	else if(recTrans[i].transNach == recKonten[j].code) {
					transNachName = (recKonten[j].ktoVorName) ? recKonten[j].ktoVorName + ' ' + recKonten[j].ktoNachName : recKonten[j].ktoName;			
					transNachIdent = recKonten[j].ktoIdent;
				}
			}

			// Gebuchter Betrag muss ggf. in Referenzwährung umgerechnet werden
			//
			if(recTrans[i].transCurrency == refCurrency) {										// gleich Referenzwährung
				exchangeBetrag = recTrans[i].transBetrag;
			} else {																													// ungleich Referenzwährung		
				for(var j=0 in kurseArray) {																		// Array mit Wechselkursen durchlaufen
					if(kurseArray[j][0] == recTrans[i].transCurrency) {					// kursVon = refCurrency
						exchangeBetrag = recTrans[i].transBetrag * kurseArray[j][2];	
					} else if (kurseArray[j][1] == recTrans[i].transCurrency) {	// kursNach = refCurrency
						exchangeBetrag = recTrans[i].transBetrag / kurseArray[j][2];	
					}
				}
			}

			recTransArray[i] = [];		// Transaktionen in assoziatives, multidimensionales Array verpacken	
			recTransArray[i] = {'datum':recTrans[i].transDatum, 'ort':recTrans[i].transOrt, 'name':recTrans[i].transName, 'von':recTrans[i].transVon, 'vonName':transVonName, 'vonIdent':transVonIdent, 'nach':recTrans[i].transNach, 'nachName':transNachName, 'nachIdent':transNachIdent, 'betrag':recTrans[i].transBetrag, 'currency':recTrans[i].transCurrency, 'exBetrag':parseFloat(exchangeBetrag), 'exCurrency':refCurrency};

		}
	}

	// Globale Variable aller Emails von den beteiligten Personen - für Versand der Email in "To-Field". Def. in "reports.html"
	transVonEmail = uniqueArr(transVonEmail);		// Array von Duplikaten befreien
	
	// _________ Report Konten	

	// Array sortieren nach "vonName"
	recTransArray.sort(function(a, b){  			// Multidimensionales, assoziatives Array nach Datum und aufsteigend sortieren
		var a = a.vonName, b = b.vonName;
		return(a == b) ? 0 : (a > b) ? 1 : -1;	// !!! mit: "-1 und 1" vertauschen für absteigend sortieren
	});
		
	for(var i=0 in recTransArray) {	

		// Darstellung "Soll-Konto" Konto-Von
		j = (i==0) ? 0 : i-1 ; 		
		if(i==0 || recTransArray[i]['vonName'] !=	recTransArray[j]['vonName']	) {
			outKonten = recTransArray[i]['vonName'] + ':</br>' +
				'<div style="font-size:.9em; text-indent:1em;">' +
				recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + ' <span style="font-size:.8em">' + recTransArray[i]['currency'] + '</span></div>';

			outKonten_mail = recTransArray[i]['vonName'] + ':\n' +
				LZ + recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + ' ' + recTransArray[i]['currency'] + '\n';

			if(recTransArray[i]['vonIdent'] == 'Fonds' || recTransArray[i]['vonIdent'] == 'Personen') {

				$("#reportKontenSoll").append(outKonten);										// Ausgabe in Soll Abschnitt
				$("#mailReport_KontenAusgaben").append(outKonten_mail);			// Ausgabe in Mail-Report Abschnitt
				
			}
			exVonBetrag += parseFloat(recTransArray[i]['exBetrag']);
		} else {
			outKonten = '<div style="font-size:.9em; text-indent:1em;">' + 
				recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + ' <span style="font-size:.8em">' + recTransArray[i]['currency'] + '</span></div>';

			outKonten_mail = LZ + recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + ' ' + recTransArray[i]['currency'] + '\n';
			
			if(recTransArray[i]['vonIdent'] == 'Fonds' || recTransArray[i]['vonIdent'] == 'Personen') {
				
				$("#reportKontenSoll").append(outKonten);										// Ausgabe in Soll Abschnitt
				$("#mailReport_KontenAusgaben").append(outKonten_mail);			// Ausgabe in Mail-Report Abschnitt
				
			}
			exVonBetrag += parseFloat(recTransArray[i]['exBetrag']);
		}

		// Berechnung Sub-Total für Von "Soll-Konto"
		j = (i==recTransArray.length) ? recTransArray.length : parseInt(i)+1 ;	// Muss numerisch sein, sonst Problem mit dem Array Index
		if(recTransArray[j]) {													// Darf nicht aus dem Array Index herauslaufen!
			if(recTransArray[i]['vonName'] != recTransArray[j]['vonName']) { 
				outBetrag = '<div style="font-size:.9em; text-indent:10em;">' +
					'Subtotal: <b>' + number_format(exVonBetrag, 2, ',', '.') + ' ' + refCurrency + '</b>';
				
				outBetrag_mail = LZ10 + 'Subtotal: ' + number_format(exVonBetrag, 2, ',', '.') + ' ' + refCurrency + '\n';
				
				if(recTransArray[i]['vonIdent'] == 'Fonds' || recTransArray[i]['vonIdent'] == 'Personen') {
					
					$("#reportKontenSoll").append(outBetrag);										// Ausgabe in Journal Abschnitt
					$("#mailReport_KontenAusgaben").append(outBetrag_mail);			// Ausgabe in Mail-Report Abschnitt
					
				}
				var arr = gesTransArray.length;
				gesTransArray[arr] = [];
				gesTransArray[arr] = {'ident':recTransArray[i]['vonIdent'], 'von':recTransArray[i]['von'], 'vonName':recTransArray[i]['vonName'], 'nach':null, 'nachName':null, 'vonBetrag':exVonBetrag, 'nachBetrag':null};

				exVonBetrag = 0.00;	
			}
		} else {
			outBetrag = '<div style="font-size:.9em; text-indent:10em;">' +
				'Subtotal: <b>' + number_format(exVonBetrag, 2, ',', '.') + ' ' + refCurrency + '</b>';

			outBetrag_mail = LZ10 +'Subtotal: ' + number_format(exVonBetrag, 2, ',', '.') + ' ' + refCurrency + '\n';
			
			if(recTransArray[i]['vonIdent'] == 'Fonds' || recTransArray[i]['vonIdent'] == 'Personen') {
				
				$("#reportKontenSoll").append(outBetrag);										// Ausgabe in Journal Abschnitt
				$("#mailReport_KontenAusgaben").append(outBetrag_mail);			// Ausgabe in Mail-Report Abschnitt
				
			}
			var arr = gesTransArray.length;
			gesTransArray[arr] = [];
			gesTransArray[arr] = {'ident':recTransArray[i]['vonIdent'], 'von':recTransArray[i]['von'], 'vonName':recTransArray[i]['vonName'], 'nach':null, 'nachName':null, 'vonBetrag':exVonBetrag, 'nachBetrag':null};

			exVonBetrag = 0.00;	
		}

	}

	// Array sortieren nach "nachName"
	recTransArray.sort(function(a, b){  			// Multidimensionales, assoziatives Array nach Datum und aufsteigend sortieren
		var a = a.nachName, b = b.nachName;
		return(a == b) ? 0 : (a > b) ? 1 : -1;	// !!! mit: "-1 und 1" vertauschen für absteigend sortieren
	});	
		
	for(var i=0 in recTransArray) {	
	
		// Darstellung "Haben-Konto" Konto-Nach	
		j = (i==0) ? 0 : i-1 ; 		
		if(i==0 || recTransArray[i]['nachName'] !=	recTransArray[j]['nachName']	) {
		
			outKonten = recTransArray[i]['nachName'] + ':</br>' +
				'<div style="font-size:.9em; text-indent:1em;">' + 
				recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + ' <span style="font-size:.8em">' + recTransArray[i]['currency'] + '</span></div>';

			outKonten_mail = recTransArray[i]['nachName'] + ':\n' +
				LZ + recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + recTransArray[i]['currency'] + '\n';

			if(recTransArray[i]['nachIdent'] == 'Fonds' || recTransArray[i]['nachIdent'] == 'Personen') {
				
				$("#reportKontenHaben").append(outKonten);									// Einnahmen in Haben Abschnitt
				$("#mailReport_KontenEinnahmen").append(outKonten_mail);			// Einnahmen in Mail-Report Abschnitt
				
			} else if(recTransArray[i]['nachIdent'] == 'Sachen') {
				
				$("#reportKontenSachen").append(outKonten);									// Sachen in Soll Abschnitt
				$("#mailReport_KontenSachen").append(outKonten_mail);				// Sachen in Mail-Report Abschnitt
			}
			
			exNachBetrag += parseFloat(recTransArray[i]['exBetrag']);

		} else {
			outKonten = '<div style="font-size:.9em; text-indent:1em;">' + 
				recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + ' <span style="font-size:.8em">' + recTransArray[i]['currency'] + '</span></div>';

			outKonten_mail = LZ + recTransArray[i]['name'] + ': ' + number_format(recTransArray[i]['betrag'], 2, ',', '.') + ' ' + recTransArray[i]['currency'] + '\n';

			if(recTransArray[i]['nachIdent'] == 'Fonds' || recTransArray[i]['nachIdent'] == 'Personen') {
				
				$("#reportKontenHaben").append(outKonten);									// Einnahmen in Haben Abschnitt
				$("#mailReport_KontenEinnahmen").append(outKonten_mail);			// Einnahmen in Mail-Report Abschnitt
				
			} else if(recTransArray[i]['nachIdent'] == 'Sachen') {
				
				$("#reportKontenSachen").append(outKonten);									// Sachen in Soll Abschnitt
				$("#mailReport_KontenSachen").append(outKonten_mail);				// Sachen in Mail-Report Abschnitt
				
			}
			
			exNachBetrag += parseFloat(recTransArray[i]['exBetrag']);

		}

		// Berechnung Sub-Total für Nach "Haben-Konto"
		j = (i==recTransArray.length) ? recTransArray.length : parseInt(i)+1 ;	// Muss numerisch sein, sonst Problem mit dem Array Index
		if(recTransArray[j]) {														// Darf nicht aus dem Array Index herauslaufen!
			if(recTransArray[i]['nachName'] != recTransArray[j]['nachName']) { 

				if(recTransArray[i]['nachIdent'] == 'Fonds' || recTransArray[i]['nachIdent'] == 'Personen') {
					
					outBetrag = '<div style="font-size:.9em; text-indent:10em;">' +
						'Subtotal: <b>' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '</b>';
					
					outBetrag_mail = LZ10 + 'Subtotal: ' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '\n';
					
					$("#reportKontenHaben").append(outBetrag);									// Einnahmen in Haben Abschnitt
					$("#mailReport_KontenEinnahmen").append(outBetrag_mail);			// Einnahmen in Mail-Report Abschnitt
					
				} else if(recTransArray[i]['nachIdent'] == 'Sachen') {
					
					outBetrag = '<div style="font-size:.9em; text-indent:10em;">' +
						'Subtotal: <b>' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '</b>';

					outBetrag_mail = LZ10 + 'Subtotal: ' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '\n';

					$("#reportKontenSachen").append(outBetrag);								// Sachen in Ausgaben Abschnitt
					$("#mailReport_KontenSachen").append(outBetrag_mail);			// Sachen in Mail-Report Abschnitt
				}	

				var arr = gesTransArray.length;
				gesTransArray[arr] = [];
				gesTransArray[arr] = {'ident':recTransArray[i]['nachIdent'], 'von':null, 'vonName':null, 'nach':recTransArray[i]['nach'], 'nachName':recTransArray[i]['nachName'], 'vonBetrag':null, 'nachBetrag':exNachBetrag};

				exNachBetrag = 0.00;	
			}
		} else {
				
			if(recTransArray[i]['nachIdent'] == 'Fonds' || recTransArray[i]['nachIdent'] == 'Personen') {
				
				outBetrag = '<div style="font-size:.9em; text-indent:10em;">' +
					'Subtotal: <b>' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '</b>';
				
				outBetrag_mail = LZ10 + 'Subtotal: ' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '\n';
				
				$("#reportKontenHaben").append(outBetrag);									// Einnahmen in Haben Abschnitt
				$("#mailReport_KontenEinnahmen").append(outBetrag_mail);			// Einnahmen in Mail-Report Abschnitt
				
			} else if(recTransArray[i]['nachIdent'] == 'Sachen' || recTransArray[i]['nachIdent'] == 'Personen') {
				
				outBetrag = '<div style="font-size:.9em; text-indent:10em;">' +
					'Subtotal: <b>' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '</b>';
				
				outBetrag_mail = LZ10 + 'Subtotal: ' + number_format(exNachBetrag, 2, ',', '.') + ' ' + refCurrency + '\n';
				
				$("#reportKontenSachen").append(outBetrag);								// Sachen in Ausgaben Abschnitt
				$("#mailReport_KontenSachen").append(outBetrag_mail);			// Sachen in Mail-Report Abschnitt
				
			}	
				
			var arr = gesTransArray.length;
			gesTransArray[arr] = [];
			gesTransArray[arr] = {'ident':recTransArray[i]['nachIdent'], 'von':null, 'vonName':null, 'nach':recTransArray[i]['nach'], 'nachName':recTransArray[i]['nachName'], 'vonBetrag':null, 'nachBetrag':exNachBetrag};

			exNachBetrag = 0.00;	
		}

	}
	
	// _________ Report Journal chronologisch austeigend
	//	
	recTransArray.sort(function(a, b){  // Multidimensionales, assoziatives Array nach Datum und aufsteigend sortieren
		var a = a.datum, b = b.datum;
		return(a == b) ? 0 : (a > b) ? 1 : -1;	// !!! mit: "-1 und 1" vertauschen für absteigend sortieren
	});	

	for(var i=0 in recTransArray) {
		var ort = (recTransArray[i]['ort']) ? ' (' + recTransArray[i]['ort'] + ')' : '';
		var outJournal = recTransArray[i]['datum'] + 	
			'<span style="font-size:.9em">' +
			ort + ': </br>' +
			recTransArray[i]['name'] + '</br>' +
			recTransArray[i]['vonName'] + ' an ' + recTransArray[i]['nachName'] + 
	
// Ausgabe mit Währungsumrechnung					
//			' : ' + number_format(recTransArray[i]['betrag'], 0, ',', '.') + ' / ' + number_format(recTransArray[i]['exBetrag'], 2, ',', '.') +
//			' <span style="font-size:.8em">' +	
//			recTransArray[i]['currency'] + ' / ' + recTransArray[i]['exCurrency'] +

			' : ' + number_format(recTransArray[i]['betrag'], 0, ',', '.') + 
			' <span style="font-size:.8em">' +	
			recTransArray[i]['currency'] +

			'</span></span><hr size="1px" align="left" width="50%" color="#c0c0c0" noshade>';

		var outJournal_mail = recTransArray[i]['datum'] +
		' ' + ort + ':\n' +
		recTransArray[i]['name'] + '\n' +
		recTransArray[i]['vonName'] + ' an ' + recTransArray[i]['nachName'] +
		' : ' + number_format(recTransArray[i]['betrag'], 0, ',', '.') +
		' ' + recTransArray[i]['currency'] +
		'\n----------------------\n';
		
		$("#reportJournal").append(outJournal);										// Ausgabe in Journal Abschnitt
		$("#mailReport_reportJournal").append(outJournal_mail);		// Ausgabe in Journal Abschnitt
	}
	
	// _______ Gesamtausgaben berechnen
	//
	for(var i=0 in recTransArray) {
		if(recTransArray[i]['vonIdent'] == 'Fonds' && recTransArray[i]['nachIdent'] == 'Sachen') {	
			gesBetrag += recTransArray[i]['exBetrag'];
		} else if(recTransArray[i]['vonIdent'] == 'Personen' && recTransArray[i]['nachIdent'] == 'Sachen') {
			gesBetrag += recTransArray[i]['exBetrag'];
		}
	}

	// _______ Abrechnung darstellen
	//
	gesTransArray.sort(function(a, b){ 				// Multidimensionales, assoziatives Array nach Datum und aufsteigend sortieren
		var a = a.ident, b = b.ident;
		return(a == b) ? 0 : (a > b) ? 1 : -1;	// !!! mit: "-1 und 1" vertauschen für absteigend sortieren
	});
	
	// Array gleicher Konten zusammenführen, damit Kontoname Soll/Haben entsteht
	for(var i=0 in gesTransArray) {
		for(var j=i in gesTransArray) {
			if(gesTransArray[i]['von'] == gesTransArray[j]['nach']) {
				gesTransArray[i] = {'ident':gesTransArray[i]['ident'], 'von':gesTransArray[i]['von'], 'vonName':gesTransArray[i]['vonName'], 'nach':gesTransArray[j]['nach'], 'nachName':gesTransArray[j]['nachName'], 'vonBetrag':gesTransArray[i]['vonBetrag'], 'nachBetrag':gesTransArray[j]['nachBetrag']};
			}
		}
	}


	// Ermittlung des Verwalter'names' und Berechnungen Saldi aller Gemeinschaftskonten
	for(var i=0 in gesTransArray) {
		// Saldo-Anteil aller Gemeinschaftskonten ermitteln
		if(gesTransArray[i]['ident'] == 'Fonds') {
			fondsGesBetrag += gesTransArray[i]['vonBetrag'] - gesTransArray[i]['nachBetrag'];
		}
		// Verwalter des Journals von Code in Name ermitteln
		if(gesTransArray[i]['von'] == journalLeader) {
			journalLeaderName = gesTransArray[i]['vonName'];
		}
	}
	
	// Gesamtbetrag darstellen
	var gesAbrechnung = '<span style="font-size:.8em">' +
		'Ausgaben insgesamt: <b>' + number_format(gesBetrag, 0, ',', '.') + ' <span style="font-size:.8em">' + refCurrency +'</b></span></br>' +
		'<span style="font-size:0.8em">Anzahl PAX: <b>' + gesPersonen + '</b></span></br>' +
		'<span style="font-size:0.8em">Ausgaben pro PAX: <b>' + number_format(gesBetrag / gesPersonen, 2, ',', '.') + ' <span style="font-size:.8em">' + refCurrency + '</b></span></br>' +
		'<span style="font-size:0.8em">Journal verwaltet von: <b>' + journalLeaderName + '</b></span></br>' +
		'</span>';
	$("#reportHeaderAbrechnung").append(gesAbrechnung);
	
	// Konten-Zusamenfassung im Header anzeigen	
	for(var i=0 in gesTransArray) {
		// Trennlinie zwischen Fonds- und Personen-Konten
		if(gesTransArray[i]['ident'] == 'Fonds' && gesTransArray[parseInt(i)+1]['ident'] == 'Personen') {
			$("#reportHeaderKonten").append('<hr size="1px" align="left" width="50%" color="#c0c0c0" noshade>');
		}
		// Offene Zahlungen ermitteln
		if(gesTransArray[i]['ident'] == 'Personen') {
		
			offZahlung = gesTransArray[i]['vonBetrag'] - gesTransArray[i]['nachBetrag'] - (gesBetrag / gesPersonen);
			offZahlungKasse = gesTransArray[i]['vonBetrag'] - gesTransArray[i]['nachBetrag'] - (gesBetrag / gesPersonen) + fondsGesBetrag;
			if(offZahlung < 0 || offZahlungKasse < 0) {
//				anweisungStr = '(zu wenig gezahlt)';
			} else { 
//				anweisungStr = '(zu viel gezahlt)';
			}
			
			// offene Zahlungen auslesen und erst einmal in ein Array-String speichern
			if(gesTransArray[i].vonName && gesTransArray[i]['von'] != journalLeader) {
				offZahlungPers.push(offZahlung + ';' + gesTransArray[i].vonName);
			} else if(gesTransArray[i]['von'] == journalLeader) {
				offZahlungPers.push(offZahlungKasse + ';' + gesTransArray[i].vonName);
			}
		
			// Beim Verwalter des Journals muss das Saldo der Gemeinschaftskonten subtrahiert werden
			if(gesTransArray[i]['von'] == journalLeader) {
				offZahlungStr = '<div style="text-indent:2.5em;">' +
					'<span style="font-size:1.0em">Offene Zahlung: <b>' + number_format(offZahlung, 2, ',', '.') + '</span>' +
					' <span style="font-size:.8em">' + refCurrency + '</b></span>' +
					'</div>' +

					'<div style="text-indent:2.5em;">' +
					' <span style="font-size:1.0em">Abzüglich Kasseninhalt: <b>' + number_format(offZahlungKasse, 2, ',', '.') + '</span>' +
					' <span style="font-size:.8em">' + refCurrency + '</b></span>' +
					'</div>' +

					'<div style="text-indent:3.3em;font-size:.8em;">' +
					anweisungStr +
					'</div>';
			} else {		// Normale Teilnehmer des Journals
				offZahlungStr = '<div style="text-indent:2.5em;">' +
					'<span style="font-size:1.0em">Offene Zahlung: <b>' + number_format(offZahlung, 2, ',', '.') + '</span>' +
					' <span style="font-size:.8em">' + refCurrency + '</b></span> ' +
					'</div>' +

					'<div style="text-indent:3.3em;font-size:.8em;">' +
					anweisungStr +
					'</div>';
			}
		} else { offZahlungStr = ''; }
		
		if(gesTransArray[i]['von'] !== null || gesTransArray[i]['nach'] !== null) {
			var outHeader = '<span style="font-size:.8em">' + 
				gesTransArray[i]['vonName'] + ':</br>' +
				
				'<div style="text-indent:1.5em;">' +
				'Aus.: ' + number_format(gesTransArray[i]['vonBetrag'], 2, ',', '.') +
				' <span style="font-size:.8em">' + refCurrency + '</span>' +
				
				'<span style="font-size:1.0em">' +
				', Ein.: ' + number_format(gesTransArray[i]['nachBetrag'], 2, ',', '.') + 
				' <span style="font-size:.8em">' + refCurrency + '</span> ' +
				'</div>' +
				
				'<div style="text-indent:2.5em;">' +
				'<span style="font-size:1.0em">Überschuss: ' + number_format(gesTransArray[i]['vonBetrag'] - gesTransArray[i]['nachBetrag'], 2, ',', '.') + '</span>' +
				' <span style="font-size:.8em">' + refCurrency + '</span> ' +
				'</div>' +
				
				offZahlungStr;
				
			$("#reportHeaderKonten").append(outHeader);	
		}
	}
	$("#reportHeaderKonten").append('<span style="font-size:.7em">(+ zuviel, - zu wenig gezahlt)</span>');
	
	
	// Zahlungsplan errechnen
	//
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
	
	
//	 DEBUG	Code
//		var tmp = '';
//		for(var i=0 in zahlungenArr) {
//			tmp += zahlungenArr[i]['betrag'] + '\n';
//		}
//		alert('Zahlungen: ' + zahlungenArr.length + '\n' + tmp);
	
	
	var anzahl = zahlungenArr.length - 1;		// Anzahl Teilnehmer inkl. 0 !!!
	var j = 0;
	
	do {

//	 DEBUG	Code
//		alert('Rest: ' + parseFloat(zahlungenArr[anzahl]['betrag']) + ' plus ' + parseFloat(zahlungenArr[j]['betrag']));
		
		if(parseFloat(zahlungenArr[anzahl]['betrag']) <= 0.00) {
			
			var rest = parseFloat(zahlungenArr[anzahl]['betrag']) + parseFloat(zahlungenArr[j]['betrag']);
			
			if(rest < 0) {
				
				minusPersonen += '<div style="text-indent:1.5em;">' + zahlungenArr[anzahl]['name'] + ' zahlt: ' + number_format(zahlungenArr[j]['betrag'], 2, ',', '.') + ' ' + refCurrency + ' an: ' + zahlungenArr[j]['name'] + '</div>';
				var tmpZahl = zahlungenArr[anzahl]['betrag'];
				zahlungenArr[anzahl]['betrag'] = rest;
				zahlungenArr[j]['betrag'] = tmpZahl + parseFloat(zahlungenArr[j]['betrag']) - rest;

//	 DEBUG	Code
//alert('A rest <0\n j: ' + j + ', anzahl: ' + anzahl + ', rest: ' + number_format(rest) + '\n' + minusPersonen);
				
				j++;
				
			} else {
				
				minusPersonen += '<div style="text-indent:1.5em;">' + zahlungenArr[anzahl]['name'] + ' zahlt: ' + number_format(zahlungenArr[anzahl]['betrag'] * -1, 2, ',', '.') + ' ' + refCurrency + ' an: ' + zahlungenArr[j]['name'] + '</div>';
				var tmpZahl = zahlungenArr[anzahl]['betrag'];
				zahlungenArr[anzahl]['betrag'] = parseFloat(zahlungenArr[anzahl]['betrag']) - parseFloat(zahlungenArr[anzahl]['betrag']);
				zahlungenArr[j]['betrag'] = parseFloat(zahlungenArr[j]['betrag']) + tmpZahl;
				
//	 DEBUG	Code
//alert('B rest >0\n j: ' + j + ', anzahl: ' + anzahl + ', rest: ' + number_format(rest) + '\n' + minusPersonen);
				
				anzahl--;
				
			}
			
		} else {
			
			j++;
			minusPersonen = 'tbd...'
			
		}
		
//	 DEBUG	Code
//		var tmp = '';
//		for(var i=0 in zahlungenArr) {
//			tmp += zahlungenArr[i]['betrag'] + '\n';
//		}
//		alert('L: ' + zahlungenArr.length + '\n' + tmp);
		
		
	} while(j < anzahl);
	
	var ZahlungsPlan = '<span style="font-size:.8em"><neue Zeile><b>Zahlungsplan:</b><br>' +
		minusPersonen +
		'</span>';
	
	$("#reportZahlungsplan").append(ZahlungsPlan);
	
}


// _________ Google Analytics
//
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-99303104-1', 'auto');
ga('send', 'pageview');


// EOF