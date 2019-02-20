<?php
	header('Content-Type: text/cache-manifest');
	echo "CACHE MANIFEST\n";
	$hashes = "";
#	$dateiname = "./viajournal.manifest";
#	$datei = fopen($dateiname, "w+");
#	fwrite($datei, "CACHE MANIFEST\n");
#	$zeilen = file($dateiname);
#	$letzte_zeile = $zeilen[count($zeilen)-1];
	$dir = new RecursiveDirectoryIterator(".");
	foreach(new RecursiveIteratorIterator($dir) as $file) {
		if ($file->IsFile() && $file != "./manifest.php" && substr($file->getFilename(), 0, 1) != ".") {
			echo $file . "\n";
#			fwrite($datei, $file . "\n");
			$hashes .= md5_file($file);
		}
	}
#	fwrite($datei, "# Hash:" . md5($hashes));
#	fclose($datei);
	echo "# Hash:" . md5($hashes) . "\n";	
#	if ($letzte_zeile != "# Hash:" . md5($hashes)) {
#	}
?>
