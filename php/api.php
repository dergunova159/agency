<?php
  require_once "../properties/phpProperties.php";

  function getConnection($host, $user, $pass, $db) {
    $conn = new mysqli($host, $user, $pass, $db);
    if($conn->connect_error)
      throw new Exception("Unable to connect database");
    return $conn;
  }

  // *** TOURS API
  // 1. select return: [{tour_id,tour_name,tour_days,tour_cost,img_src,tour_date,status}]
  function getTours($conn) {
    $data = array();
    $res = $conn->query("SELECT * FROM tour where status=1");
    if($res) {
      while($obj = $res->fetch_object()) {
          array_push($data, $obj);
      }
    }
    return $data;
  }

  function getByParams($conn, $startDate, $endData, $cost) {
    $data = array();
    if (!($stmt = $conn->prepare("SELECT * FROM tour where tour_date between ? AND ? and tour_cost <= ?")))
      throw new Exception($conn->error);
    if (!$stmt->bind_param("ssi", $startDate, $endData, $cost))
      throw new Exception($stmt->error);
    $stmt->execute();
    $res = $stmt->get_result();
    if($res) {
      while($obj = $res->fetch_object()) {
          array_push($data, $obj);
      }
    }
    $stmt->close();
    return $data;
  }

  
  
  //*** REVIEW API
  // 1. select return: [{review_id, review_data, review_text}]
  function getReviews($conn) {
    $data = array();
    $res = $conn->query("SELECT * FROM review order by review_data DESC limit 10");
    if($res) {
      while($obj = $res->fetch_object()) {
          array_push($data, $obj);
      }
    }
    return $data;
  }

  // 2. insert: param: {text: string}
  function insertReview($conn, $text) {
    $sql = "INSERT into review (review_text, review_data) values (?, NOW())";
    if (!($stmt = $conn->prepare($sql))) 
      throw new Exception($stmt->error);
    if (!$stmt->bind_param("s", $text))
      throw new Exception($stmt->error);
    $stmt->execute();
    if($stmt->affected_rows < 1)
      throw new Exception('Failed sql');
    $stmt->close();
    return array("res" =>"success");
  }

    

  // *** ROUTE
  try {
    $action = $_POST['action'];
    $conn = getConnection($dbHost, $dbUsername, $dbPassword, $dbName);
    switch($action) {
      case "allTours": 
        $res = getTours($conn); 
        break;
      case "toursParam": 
        $res = getByParams($conn, htmlentities($_POST['startDate']), htmlentities($_POST['endDate']), htmlentities($_POST['cost'])); 
        break;
      case "addReview":
        $res = insertReview($conn, htmlentities($_POST['reviewText']));
        break;
      case "prevReviews":
        $res = getReviews($conn);
        break;
    }
    $conn->close();
  } catch(Exception $err) {
    die(json_encode(array('message' => $err->getMessage())));
  }
  echo json_encode($res);
?>