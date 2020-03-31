<?php
if (!function_exists('http_parse_headers')) {
    function http_parse_headers($raw_headers) {
        $headers = array();
        $key = '';

        foreach(explode("\n", $raw_headers) as $i => $h) {
            $h = explode(':', $h, 2);

            if (isset($h[1])) {
                if (!isset($headers[$h[0]]))
                    $headers[$h[0]] = trim($h[1]);
                elseif (is_array($headers[$h[0]])) {
                    $headers[$h[0]] = array_merge($headers[$h[0]], array(trim($h[1])));
                }
                else {
                    $headers[$h[0]] = array_merge(array($headers[$h[0]]), array(trim($h[1])));
                }

                $key = $h[0];
            }
            else {
                if (substr($h[0], 0, 1) == "\t")
                    $headers[$key] .= "\r\n\t".trim($h[0]);
                elseif (!$key)
                    $headers[0] = trim($h[0]);
            }
        }

        return $headers;
    }
}
	 function decode($data){
		$unmaskedPayload = '';
		$decodedData = array();

		// estimate frame type:
		$firstByteBinary = sprintf('%08b', ord($data[0]));
		$secondByteBinary = sprintf('%08b', ord($data[1]));
		$opcode = bindec(substr($firstByteBinary, 4, 4));
		$isMasked = ($secondByteBinary[0] == '1') ? true : false;
		$payloadLength = ord($data[1]) & 127;

		// unmasked frame is received:
		if (!$isMasked) {
			return array('type' => '', 'payload' => '', 'error' => 'protocol error (1002)');
		}

		switch ($opcode) {
			// text frame:
			case 1:
				$decodedData['type'] = 'text';
				break;

			case 2:
				$decodedData['type'] = 'binary';
				break;

			// connection close frame:
			case 8:
				$decodedData['type'] = 'close';
				break;

			// ping frame:
			case 9:
				$decodedData['type'] = 'ping';
				break;

			// pong frame:
			case 10:
				$decodedData['type'] = 'pong';
				break;

			default:
				return array('type' => '', 'payload' => '', 'error' => 'unknown opcode (1003)');
		}

		if ($payloadLength === 126) {
			$mask = substr($data, 4, 4);
			$payloadOffset = 8;
			$dataLength = bindec(sprintf('%08b', ord($data[2])) . sprintf('%08b', ord($data[3]))) + $payloadOffset;
		} elseif ($payloadLength === 127) {
			$mask = substr($data, 10, 4);
			$payloadOffset = 14;
			$tmp = '';
			for ($i = 0; $i < 8; $i++) {
				$tmp .= sprintf('%08b', ord($data[$i + 2]));
			}
			$dataLength = bindec($tmp) + $payloadOffset;
			unset($tmp);
		} else {
			$mask = substr($data, 2, 4);
			$payloadOffset = 6;
			$dataLength = $payloadLength + $payloadOffset;
		}

		/**
		 * We have to check for large frames here. socket_recv cuts at 1024 bytes
		 * so if websocket-frame is > 1024 bytes we have to wait until whole
		 * data is transferd.
		 */
		if (strlen($data) < $dataLength) {
			return false;
		}

		if ($isMasked) {
			for ($i = $payloadOffset; $i < $dataLength; $i++) {
				$j = $i - $payloadOffset;
				if (isset($data[$i])) {
					$unmaskedPayload .= $data[$i] ^ $mask[$j % 4];
				}
			}
			$decodedData['payload'] = $unmaskedPayload;
		} else {
			$payloadOffset = $payloadOffset - 4;
			$decodedData['payload'] = substr($data, $payloadOffset);
		}

		return $decodedData;
	}
	function encode($payload, $type = 'text', $masked = false){
		$frameHead = array();
		$payloadLength = strlen($payload);

		switch ($type) {
			case 'text':
				// first byte indicates FIN, Text-Frame (10000001):
				$frameHead[0] = 129;
				break;

			case 'close':
				// first byte indicates FIN, Close Frame(10001000):
				$frameHead[0] = 136;
				break;

			case 'ping':
				// first byte indicates FIN, Ping frame (10001001):
				$frameHead[0] = 137;
				break;

			case 'pong':
				// first byte indicates FIN, Pong frame (10001010):
				$frameHead[0] = 138;
				break;
		}

		// set mask and payload length (using 1, 3 or 9 bytes)
		if ($payloadLength > 65535) {
			$payloadLengthBin = str_split(sprintf('%064b', $payloadLength), 8);
			$frameHead[1] = ($masked === true) ? 255 : 127;
			for ($i = 0; $i < 8; $i++) {
				$frameHead[$i + 2] = bindec($payloadLengthBin[$i]);
			}
			// most significant bit MUST be 0
			if ($frameHead[2] > 127) {
				return array('type' => '', 'payload' => '', 'error' => 'frame too large (1004)');
			}
		} elseif ($payloadLength > 125) {
			$payloadLengthBin = str_split(sprintf('%016b', $payloadLength), 8);
			$frameHead[1] = ($masked === true) ? 254 : 126;
			$frameHead[2] = bindec($payloadLengthBin[0]);
			$frameHead[3] = bindec($payloadLengthBin[1]);
		} else {
			$frameHead[1] = ($masked === true) ? $payloadLength + 128 : $payloadLength;
		}

		// convert frame-head to string:
		foreach (array_keys($frameHead) as $i) {
			$frameHead[$i] = chr($frameHead[$i]);
		}
		if ($masked === true) {
			// generate a random mask:
			$mask = array();
			for ($i = 0; $i < 4; $i++) {
				$mask[$i] = chr(rand(0, 255));
			}

			$frameHead = array_merge($frameHead, $mask);
		}
		$frame = implode('', $frameHead);

		// append payload to frammac os php sockets issuese:
		for ($i = 0; $i < $payloadLength; $i++) {
			$frame .= ($masked === true) ? $payload[$i] ^ $mask[$i % 4] : $payload[$i];
		}

		return $frame;
	}
	 function handshake($data, $accept){
	  if(empty($data) || $data == ""){
		usleep(100);
		socket_recv($accept, $data, 100000000, MSG_DONTWAIT);
	  }
	  $info = http_parse_headers($data);
	  var_dump($info);
	  if(isset($info['Sec-WebSocket-Key'])){
		echo "Start handshake...";
		$key = base64_encode(pack('H*', sha1($info['Sec-WebSocket-Key'] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
		$upgrade = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
		  "Upgrade: websocket\r\n" .
		  "Connection: Upgrade\r\n" .
		  "Sec-WebSocket-Accept:$key\r\n\r\n";
		socket_write($accept,$upgrade);
		echo "Finish handshake";
		return true;
	  }
	  else{
		return false;
	  }

	}
	function ascii_to_bin($data){
		$res = "";
		for($i = 0; $i < strlen($data); $i++){
			$res .= sprintf('%08b', ord($data[$i]));
		}
		return $res;
	}
	function go($ip, $port){
		echo "GO() ... <br />\r\n";

		echo "socket_create ...";
		$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		if($socket < 0){
			echo "Error: ".socket_strerror(socket_last_error())."<br />\r\n";
			exit();
		} else {
			echo "OK <br />\r\n";
		}


		echo "socket_bind ...";
		$bind = socket_bind($socket, $ip, $port);
		if($bind < 0){
			echo "Error: ".socket_strerror(socket_last_error())."<br />\r\n";
			exit();
		}else{
			echo "OK <br />\r\n";
		}

		socket_set_option($socket, SOL_SOCKET, SO_KEEPALIVE, 1);//разрешаем использовать один порт для нескольких соединений

		echo "Listening socket... ";
		$listen = socket_listen($socket, 100);//слушаем сокет

		if($listen < 0){
			echo "Error: ".socket_strerror(socket_last_error())."<br />\r\n";
			exit();
		} else {
			echo "OK <br />\r\n";
		}
		$socket_arr = array();
		socket_set_nonblock($socket);
		while(true){ //Бесконечный цикл ожидания подключений
		  $accept = socket_accept($socket);
		  if($accept != false){
				echo "OK <br />\r\n";
				echo "Client \"".$accept."\" has connected<br />\r\n";
				$res = array("socket" => $accept, "handshake" => false);
				array_push($socket_arr, $res);
			}
			for($i = 0; $i < count($socket_arr); $i++){
				$close = false;
				$curr = &$socket_arr[$i];
				$data = "";
				socket_recv($curr["socket"], $data, 100000000, MSG_DONTWAIT);
				if($data !== "" && $data !== false && !empty($data)){
					if($curr["handshake"]){
					  echo "Send";
					  $data_arr = decode($data, $close);
					  if($data_arr["type"] == "ping"){
						  socket_write($curr["socket"],encode("h", "pong"));
					  }
					  else if($data_arr["type"] == "close"){
						  socket_write($curr["socket"], encode("h", "close"));
					  }
					}
					else{
						var_dump($data);
						if(handshake($data, $curr["socket"])){
							$curr["handshake"] = true;
							var_dump($res);
							if(!empty($res)){
								for($i = count($res) - 1; $i >= 0; $i--){
									echo $res[$i];
									socket_write($curr["socket"], encode($res[$i], "text"));
								}
							}
						}
					}
				}
				sleep(1);
				if ($curr['handshake']) {
					$message = ["lat" => rand(-90,90), "lng" => rand(-180, 180)];
					$message = json_encode($message);
					socket_write($curr["socket"], encode($message, "text"));
				}
			}
		}
	}
error_reporting(E_ALL); //Выводим все ошибки и предупреждения
set_time_limit(0);		//Время выполнения скрипта не ограничено
ob_implicit_flush();	//Включаем вывод без буферизации
ignore_user_abort(true);
$socket = go('127.0.0.1',5000);			//Функция с бесконечным циклом, возвращает $socket по запросу выполненному по прошествии 100 секнуд.
